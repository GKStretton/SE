const calendarId = 'gen9kai518437ib6jc8sq2dsfg@group.calendar.google.com'; // test calendar
const pug = require('pug');
const lockCalendarId = 'f60vk9un5f4ajucgu5165go8m8@group.calendar.google.com'; // lock calendar
const {google} = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('client-sessions'); //cookies
const RFC4122 = require('rfc4122'); //unique id for calendar event
let rfc4122 = new RFC4122();
//mail stuff
const nodemailer = require('nodemailer');
const emailCredentials = require('./tokens/emailCredentials.json');
let mailOptions = {
    service : 'gmail',
    secure:true,
    auth:{
        user: emailCredentials.username,
        pass:emailCredentials.password
    }
}

let mailDefaults = {
    from: 'group6.se.durham@gmail.com'
}
let mailTransporter = nodemailer.createTransport(mailOptions, mailDefaults);
var message = {
    to: 'group6.se.durham@gmail.com',
    subject:'test',
    html:'<p>test</p>'
}
/* 
* test message for nodemailer
mailTransporter.sendMail(message,function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log('message sent');
    }
})
*/
const calendarFunctions = require('./googleApiFunctions'); // functions which call google calendar api
//const paypalSecret = require("./tokens/paypalSecret.json");
const paypalId = require("./tokens/paypalId.json");
const paypalApiFunctions = require('./paypalApiFunctions.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'views')));
app.use(session({
  cookieName: "myCookie",
  secret: "ucndh34634h48dhsdtywefhsdf7sdf", //some long string used to sign the cookie
  duration: 24 * 60 * 60 * 1000,
  activeDuration: 1000 * 60 * 5
}));
app.use(function(req,res,next){
    if(typeof req.myCookie.booking == "undefined"){
        req.myCookie.booking = {};
    }   

    console.log('doing cookies')
    console.log(req.myCookie);
    next();
});
app.set('view engine','pug');
const bookingRouter = express.Router();
app.use('/booking',bookingRouter); //only requests to '/booking/* will use bookingRouter, this router can therefore handle our requests for booking and payment

const privatekey = require("./tokens/private-key.json"); //private key from google service account, service acc email also has to be added to each calendar manually
// configure a JWT auth client
var jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/calendar']);

//authenticate request
jwtClient.authorize(function(err, tokens) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log('Calendar api successfully authenticated');
    }
});

//serve root page - TEMP ACTION, SERVE TEMPLATE (real action is to server homepage)
app.get('/',function(req,res){
	res.render('template');
});

app.get('/facility',function(req,res){
	//top_image:banner image source location 
	//side_image:source of display images 	TODO have multiple sources to populate a slideshow
	//availability: times where strings include day data e.g. 'Monday: 12:00-16:00'
	//pricing:formatted string containing pricing info
	const facility = res.render('facility-template',{
		top_image:'/img/astroturf-top.jpg',
		page_name:"Astro Turf",
		side_image:'/img/astroturf-side.jpg',
		description:"Description yes yes yes",
		availability:"THIS IS AVAILABILITY YADA YADA YADA",
		pricing:"this is pricing, yeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
	});
});

app.get('/form',function(req,res){
    //res.redirect('form.html');
    res.render('form-automated');
});

app.get('/payment',function(req,res){
    paymentData = {
        facility: req.myCookie.booking.facility
    }
    res.render('payment-page',paymentData);
});
//query that creates a lock on a slot
bookingRouter.post('/lockRequest',function(req,res){
    req.myCookie.booking.eventName = req.body.eventName;
    req.myCookie.booking.facility = req.body.facility; 
    calendarFunctions.checkBusy(calendarId,lockCalendarId, jwtClient,req.body.startTime, req.body.endTime,'test',function(err,response){
        if(err){
            console.log(err.code);
            console.log('Check busy error: ' + err.message);
            res.status(400).send('Error: We couldn\'t make your booking'); // some sort of error occurs on google's side
        }
        else{
            if (response == 'busy'){
                console.log('busy');
                res.status(400).send('Error: The time slot you chose is already booked'); //if the slot is busy
            }
            else{ // if not busy, we lock the slot, the user still needs to pay though
                let eventId =  rfc4122.v1(); 
                eventId = eventId.replace(/-/g,"");
                console.log(eventId);
                let lockDate = new Date();
                let currentTime = lockDate.getTime();
                let lockObject = JSON.stringify({ // put json in the event description
                    'facility':'test',
                    'time':currentTime
                })
                calendarFunctions.addEvent(lockCalendarId, jwtClient,req.body.startTime, req.body.endTime,'lock',lockObject,eventId,function(err){
                    if(err){
                        console.log(err.code);
                        console.log(err.message);
                        res.status(400).send('Error: We could\'t make your booking'); // some sort of error occurs on google's side
                    }
                    else{
                        console.log('200');
                        req.myCookie.booking.eventId = eventId;
                        res.sendStatus(200); //success
                        setTimeout(function(){calendarFunctions.deleteEvent(lockCalendarId,jwtClient,eventId)},120000); //delete lock on timeout
                    }
                }); 
            }
        }
    }); 
});

bookingRouter.post('/cancelBooking',function(req,res){
    deleteEvent(calendarId,jwtClient,req.myCookie.booking.eventId,function(err){
        if(err){
            res.sendStatus(400);
        }
        else{
            res.sendStatus(200);
        }
    });
});

//creates a paypal payment and sends the id to front end button script
bookingRouter.post('/createPayment',function(req,res){
    paypalApiFunctions.createPayment(
        paypalId.clientId,
        '',
        '0.01',
        'http://localhost:5000/form/payment/sucess', 
        'http://localhost:5000/payment/cancel', 
        function(err,response){
            if(err){
                console.log(err);
                res.send(400);
            }
            else{
                console.log(response.body.id);
                res.json({
                    id:response.body.id
                });
            }
        })
});

//checks if lock is stil in place, if so, we add the actual booking event
//once sucessfully added, we then can finalise the paypal payment
bookingRouter.post('/executePayment',function(req,res){
    //check if lock is still in place
    calendarFunctions.getEvent(lockCalendarId,jwtClient,req.myCookie.booking.eventId,function(err,response){ 
        if(err){ //this means the lock is gone - we have timed out
            console.log(err);
            res.sendStatus(400);
        }
        else{
            let eventId =  rfc4122.v1(); 
            eventId = eventId.replace(/-/g,"");
            bookingJson = JSON.stringify({"facility":"test"});
            calendarFunctions.addEvent(calendarId, jwtClient,response.data.start.dateTime, response.data.end.dateTime,req.myCookie.booking.eventName,bookingJson,eventId,function(err){
                    if(err){
                        console.log(err.code);
                        console.log(err.message);
                        res.sendStatus(400); // some sort of error occurs on google's side
                    }
                    else{ //successfully added booking, so we can finalise the payment
                        paypalApiFunctions.executePayment(
                            paypalId.clientId,
                            '',
                            req.body.paymentID,
                            req.body.payerID,
                            function(err,response){
                                if(err){ // payment error, we have to delete the booking
                                    console.log(err)
                                    res.sendStatus(400);
                                    calendarFunctions.deleteEvent(lockCalendarId,jwtClient,eventId);
                                }
                                else{
                                    console.log('Payment executed');
                                    res.sendStatus(200);
                                    calendarFunctions.deleteEvent(lockCalendarId,jwtClient,req.myCookie.booking.eventId); // delete the lock event, we no longer need
                                }
                            });
                    }
            });
        }   
    });
});


app.listen(5000);