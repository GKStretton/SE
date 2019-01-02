const {google} = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
apiFunctions = require('./functions');
addEvent = apiFunctions.addEvent;
checkBusy = apiFunctions.checkBusy;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const privatekey = require("./private-key.json");
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
        console.log("Successfully connected!");
    }
});

startTime = '2019-01-01T23:30:00.0z';
endTime = '2019-01-01T23:40:00.0z';
calendarId = 'ul3q8rqrmurad3mm8495066r8k@group.calendar.google.com';
//test query

checkBusy(startTime, endTime, calendarId, jwtClient,function(err,response){
    if(err){
        console.log(err.code);
        console.log(err.message);
        return false;
    }
    else{
        if (response == 'busy'){
            console.log('busy');
            return false;
        }
        else{ // if not busy, we can insert the event
            addEvent(startTime, endTime, calendarId,'testevent', jwtClient); 
        }
    }
}); 

