const calendarId = 'ul3q8rqrmurad3mm8495066r8k@group.calendar.google.com'; // test calendar
const {google} = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('client-sessions'); //cookies
const RFC4122 = require('rfc4122');
let rfc4122 = new RFC4122();
const calendarFunctions = require('./googleApiFunctions'); // functions which call google calendar api
//const paypalSecret = require("./paypalSecret.json");
const paypalId = require("./paypalId.json");
const paypalApiFunctions = require('./paypalApiFunctions.js');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname,'public')));
app.use(session({
  cookieName: "myCookie",
  secret: "ucndh34634h48dhsdtywefhsdf7sdf", //some long string used to sign the cookie
  duration: 24 * 60 * 60 * 1000,
  activeDuration: 1000 * 60 * 5
}));
app.use(function(req,res,next){
    req.myCookie.booking = {};        
    console.log('doing cookies')
    console.log(req.myCookie);
    next();
});
const bookingRouter = express.Router();
app.use('/booking',bookingRouter); //only requests to '/booking/* will use bookingRouter, this router can therefore handle our requests for booking and payment

const privatekey = require("./private-key.json"); //private key from google service account, service acc email also has to be added to each calendar manually
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

app.get('/form',function(req,res){
    res.redirect('form.html');
});

//query that creates a lock on a slot
bookingRouter.post('/lockRequest',function(req,res){
    console.log(req.myCookie);
    calendarFunctions.checkBusy(calendarId, jwtClient,req.body.startTime, req.body.endTime,function(err,response){
        if(err){
            console.log(err.code);
            console.log('Check busy error: ' + err.message);
            res.status(400).send('invalid'); // some sort of error occurs on google's side
        }
        else{
            if (response == 'busy'){
                console.log('busy');
                res.status(400).send('busy'); //if the slot is busy
            }
            else{ // if not busy, we lock the slot, the user still needs to pay though
                let eventId =  rfc4122.v1(); 
                eventId = eventId.replace(/-/g,"")
                console.log(eventId);
                calendarFunctions.addEvent(calendarId, jwtClient,req.body.startTime, req.body.endTime,'locked',eventId,function(err){
                    if(err){
                        console.log(err.code);
                        console.log(err.message);
                        res.status(400).send('invalid'); // some sort of error occurs on google's side
                    }
                    else{
                        console.log('200');
                        req.myCookie.booking.eventId = eventId;
                        res.sendStatus(200); //success
                        setTimeout(function(){calendarFunctions.deleteEvent(calendarId,jwtClient,eventId)},120000); //delete lock on timeout
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

bookingRouter.post('/createPayment',function(req,res){
    paypalApiFunctions.createPayment(paypalId.clientId,
        '',
        '0.01',
        'http://localhost:5000/form',
        'http://localhost:5000/form',
        function(err,response){
            if(err){
                console.log(err);
                res.send(400);
            }
            else{
                console.log('Created payment');
                console.log(response.body.id);
                res.json({
                    id:response.body.id
                });
            }
        })
});

bookingRouter.post('/executePayment',function(req,res){

});


app.listen(5000);