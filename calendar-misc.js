// BACKEND STUFF
const calendarId = 'gen9kai518437ib6jc8sq2dsfg@group.calendar.google.com'; // test calendar
const lockCalendarId = 'f60vk9un5f4ajucgu5165go8m8@group.calendar.google.com'; // lock calendar
const {google} = require('googleapis');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('client-sessions'); //cookies
const RFC4122 = require('rfc4122'); //unique id for calendar event
let rfc4122 = new RFC4122();

/**** Rowans API Libraries ****/

const calendarFunctions = require('./googleApiFunctions'); // functions which call google calendar api
//const paypalSecret = require("./tokens/paypalSecret.json");
const paypalId = require("./tokens/paypalId.json");
const paypalApiFunctions = require('./paypalApiFunctions.js');


//private key from google service account, service acc email also has to be added to each calendar manually
const privatekey = require("./tokens/private-key.json");
// configure a JWT auth client
var jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/calendar']);

//authenticate request
jwtClient.authorize(function (err, tokens) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log('Calendar api successfully authenticated');
    }
});


