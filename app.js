// MONGO STUFF
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:4321';
const dbName = 'testdb';

MongoClient.connect(url, function(err, client) {
	assert.equal(null, err);
	console.log("Connected successfully to server");

	const db = client.db(dbName);

	client.close();
});

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

function repLineBreaks(text){
  return text.replace(/\r\n/g, '<br>')
}
function sendConfirmationMail(adminMail,userEmail,facility,name,date,time,info){
    let messageToAdmin = {
        to: adminMail,
        subject:'Booking Confirmation',
        html:'<p>Booking recieved: <br>'
        + 'Facility: ' + facility + '<br>'
        + 'Email: ' + userEmail + '<br>'
        + 'Name: ' + name + '<br>'
        + 'At '+ time +' on ' + date + '<br>'
        + 'Additional info: ' + repLineBreaks(info) + '<p>'
    }

    let messageToUser = {
        to: userEmail,
        subject: 'Booking Confirmation',
        html:'<p> Booking confirmation for your booking: <br>'
        + 'Facility: ' + facility + '<br>'
        + 'Email: ' + userEmail + '<br>'
        + 'Name: ' + name + '<br>'
        + 'At '+ time +' on ' + date + '</p>'
    }
    //in the below sendMail functions an option callback to catch errors could be added
    mailTransporter.sendMail(messageToAdmin);
    mailTransporter.sendMail(messageToUser);
}

function sendEnquiryMail(adminMail,facility,name,email,phone,message){
    let messageToAdmin = {
        to: adminMail,
        subject:'Booking Enquiry',
        html:'<p> Booking enquiry from ' + name + ': </br>'
        + 'Facility: ' + facility + '<br>'
        + 'Message: ' + repLineBreaks(message) + '<br>'
        + 'Email: ' + email + '<br>'
        + 'Phone: ' + phone + '<br> </p>'
    }
    mailTransporter.sendMail(messageToAdmin);
}

function sendContactMail(adminMail, name, email, phone, message) {
    let messageToAdmin = {
        to: adminMail,
        subject: 'General Enquiry',
        html: '<p> General enquiry from ' + name + ': <br />'
            + 'Message: ' + message + '<br />'
            + 'Email: ' + email + '<br />'
            + 'Phone: ' + phone + '<br /> </p>'
    }
    mailTransporter.sendMail(messageToAdmin);
}

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
  activeDuration: 1000 * 60 * 5 //5 mins
}));
app.use(function(req,res,next){
    if(typeof req.myCookie.booking == "undefined"){
        req.myCookie.booking = {};
    }
    next();
});
app.set('view engine','pug');

//private key from google service account, service acc email also has to be added to each calendar manually
const privatekey = require("./tokens/private-key.json");
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
	res.render('home');
});

/*
* This router and function let us easily render multiple facility pages
* Useful for if we want to pass more data to these pages in the future
*/
const facilityRouter = express.Router();
app.use('/facility',facilityRouter);
function serveFacility(uri,facilityName){
    facilityRouter.get(uri, function(req,res){
        res.render('facilities' + uri,{facility: facilityName});
    });
}
//now serving facilities dropdown menu pages ˅˅˅˅
serveFacility('/astro-turf','astro-turf');
serveFacility('/sports-hall','sports-hall');
serveFacility('/sports-field','sports-field');
serveFacility('/gymnasium','gymnasium');
serveFacility('/theatre','theatre');
serveFacility('/performing-arts-room','performing-arts-room');
serveFacility('/green-room','green-room');
serveFacility('/dining-hall','dining-hall');
serveFacility('/it-suite','it-suite');
serveFacility('/classrooms','classrooms');

/*please change this to use the facilityRouter
  also relocate the physical file into /facility*/
app.get('/facility-landing',function(req,res){
	res.render('facility-landing');
});

app.get('/about-us',function(req,res){
	res.render('about-us');
});

app.get('/whats-on', function(req, res) {
	res.render('whats-on');
});

app.get('/booking-enquiry', function(req, res) {
	res.render('booking-enquiry');
});

app.get('/easy-fundraising', function(req, res) {
	res.render('easy-fundraising');
});

app.get('/contact-us',function(req,res){
	res.render('contact-us');
});
//serve event pages template - will need to change
app.get('/event/:eventPage',function(req,res){
	res.render(path.join(__dirname,'views','events',req.params.eventPage));
});

//temp serve event page for testing, Nikesh will remove 
app.get('/event',function(req,res){
	res.render(path.join(__dirname,'views','events','Fast Feet Football Academy'));
});

app.post('/contact-us/submit', function(req,res) {
	sendContactMail('group6.se.durham@gmail.com',
		req.body.name,
		req.body.email,
		req.body.phone,
		req.body.message
	);
	res.end();
});

app.get('/form',function(req,res){
    //res.redirect('form.html');
    res.render('form-automated');
});

app.get('/payment',function(req,res){
    paymentData = {
        facility: req.myCookie.booking.facility
    }
    res.render('payment/payment-page',paymentData);
});

app.get('/payment/success',function(req,res){
    res.render('payment/payment-success');
});

/*
* This router is for everything concerning bookings and payment
* Functions here make the actual request to the google calendar and paypal apis
*/
const bookingRouter = express.Router();
app.use('/booking',bookingRouter); //only requests to '/booking/* will use bookingRouter, this router can therefore handle our requests for booking and payment

//manual booking enquiry
bookingRouter.post('/enquiry',function(req,res){
    sendEnquiryMail('group6.se.durham@gmail.com',
        req.body.facility,
        req.body.name,
        req.body.email,
        req.body.phone,
        req.body.enquiry
    )
    res.sendStatus(200);
});

bookingRouter.get('/enquiry/success',function(req,res){
    res.render('facilities/enquiry-success');
});

//query that creates a lock on a slot
bookingRouter.post('/lockRequest',function(req,res){
    req.myCookie.booking = req.body;
    let time = req.body.time;
    let startTime = req.body.date +'T'+ time + ":00.0z";
    console.log(time.slice(0,1));
    let incTime = (parseInt(time.slice(0,2)) + 1).toString() + time.slice(2,5);
    let endTime = req.body.date +'T'+ incTime + ":00.0z";
    console.log(startTime);
    console.log(endTime);
    calendarFunctions.checkBusy(calendarId,lockCalendarId, jwtClient,startTime,endTime,req.body.facility,function(err,response){
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
                    'facility':req.body.facility,
                    'time':currentTime
                })
                calendarFunctions.addEvent(lockCalendarId, jwtClient,startTime,endTime,'lock',lockObject,eventId,function(err){
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
        "",
        '0.01',
        'http://localhost:5000/form/payment/success',
        'http://localhost:5000/payment/cancel',
        function(err,response){
            if(err){
                console.log(err);
                res.sendStatus(400);
            }
            else{
              console.log(response.body);
                res.json({
                    id:response.body.id
                });
            }
        })
});

/*
* checks if lock is stil in place, if so, we add the actual booking event
* The event is added first, before we finalise(execute) the payment, this ensures no user ends up paying without a booking on the calendar
* In the event a payment fails to execute, we delete the booking from the calendar
*/
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
            bookingJson = JSON.stringify({"facility":req.myCookie.booking.facility});
            calendarFunctions.addEvent(calendarId, jwtClient,response.data.start.dateTime, response.data.end.dateTime,req.myCookie.booking.facility,bookingJson,eventId,function(err){
                    if(err){
                        console.log(err.code);
                        console.log(err.message);
                        res.sendStatus(400); // some sort of error occurs on google's side
                    }
                    else{ //successfully added booking, so we can finalise the payment
                        console.log(req.body);
                        paypalApiFunctions.executePayment(
                            paypalId.clientId,
                            "",
                            '0.01',
                            req.body.paymentID,
                            req.body.payerID,
                            function(err,response){
                                if(err){ // payment error, we have to delete the booking
                                    console.log(err)
                                    res.sendStatus(400);
                                    //delete lock event
                                    calendarFunctions.deleteEvent(lockCalendarId,jwtClient,req.myCookie.booking.eventId);
                                    calendarFunctions.deleteEvent(calendarId,jwtClient,eventId);
                                }
                                else{//payment achieved successfully
                                    console.log('Payment executed');
                                    res.sendStatus(200);
                                    // delete the lock event we no longer need
                                    calendarFunctions.deleteEvent(lockCalendarId,jwtClient,req.myCookie.booking.eventId);
                                    let r = req.myCookie.booking;
                                    sendConfirmationMail('group6.se.durham@gmail.com',r.email,r.facility,r.name,r.date,r.time,r.info);
                                }
                            });
                    }
            });
        }
    });
});


app.listen(5000);
