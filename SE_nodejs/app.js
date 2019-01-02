const {google} = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
apiFunctions = require('./functions');
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


//test query
apiFunctions.addEvent('2019-01-01T20:30:00.0z',
    '2019-01-01T21:30:00.0z',
    'ul3q8rqrmurad3mm8495066r8k@group.calendar.google.com',
    'testevent2',
    jwtClient
);

