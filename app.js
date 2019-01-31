// MONGO STUFF
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:4321';
const dbName = 'testdb';

/** IMPORTANT **/
/* 
 * If creating an insertion for a booking for the functions below, for collectionName
 * use 'Bookings' and for a lock use 'Locks'. Failure to comply will result in the db
 * being polluted with a bunch of random collections which is bad juju. 
 */

function deleteEntry(tgtDB,primaryKey,collectionName){
    const deleteQuery = {
        "primaryKey": primaryKey
    };
    tgtDB.collection(collectionName).deleteOne({
        deleteQuery,function(err,client){
            assert.equal(null,err);
            console.log("Entry " + primaryKey + " removed.");
        }
    });
    return 0;
}

function insertEntry(tgtDB,entry,collectionName){
    tgtDB.collection(collectionName).insertOne(entry,function(err,client){
        assert.equal(null,err);
        console.log("New entry inserted to " + collectionName + ".");
    });
    return 0;
}

MongoClient.connect(url,function(err,client){  //Creates the database and initialises it with a table for booking info.
    assert.equal(null,err);
    var dbo = client.db(dbName);
    let testBooking = { //This exists as a test booking to display the schema of the db **WIP**
        "eventID": "eventId",
        "calendarID": "calendarID",
        "authID": "authID",
        "startTime": "startTime",
        "endTime": "endTime",
        "summary": "SampleText",
        "description": "NotARealBooking"
    }
    let testLock = { //This exists as a test lock to display the schema of the db
        "eventID": "eventId",
        "eventName": "eventName",
        "email": "email@mail.com",
    }
    console.log("Database created.");
    client.close(); //Might need to be removed in case this closes the actual connection with the DB.
});

// END MONGO STUFF

// KEYSTONE STUFF
var keystone = require('keystone');

keystone.init({
	'cookie secret': 'helloworld',
	'mongo': url,
	'user model': 'User',
	'auto update': true,
	'auth': true,
	'name': 'KeystoneDB',
	'static': 'public',

	'views': 'views',
	'view engine':'pug',
});

keystone.import('models');

keystone.set('routes', require('./routes'));

keystone.start();

// END KEYSTONE STUFF

// BACKEND STUFF
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
        pass: emailCredentials.password
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

/**** Rowans API Libraries ****/

const calendarFunctions = require('./googleApiFunctions'); // functions which call google calendar api
//const paypalSecret = require("./tokens/paypalSecret.json");
const paypalId = require("./tokens/paypalId.json");
const paypalApiFunctions = require('./paypalApiFunctions.js');

/**** Serverside Code Begins Here ****/

const app = express();

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


