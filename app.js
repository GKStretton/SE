keystone = require("keystone");
mongo = require("./mongo.js");
splitAvailability = require("./splitAvailability.js");
const url = 'mongodb://localhost:4321';
// BACKEND STUFF
const bodyParser = require('body-parser');
path = require('path');
const session = require('client-sessions'); //cookies
const RFC4122 = require('rfc4122'); //unique id for calendar event
rfc4122 = new RFC4122();

/** GOOGLE CALENDAR STUFF **/
const {google} = require('googleapis');
calendarFunctions = require('./googleApiFunctions.js'); // functions which call google calendar api

//private key from google service account, service acc email also has to be added to each calendar manually
privatekey = require("./tokens/private-key.json");
// configure a JWT auth client
jwtClient = new google.auth.JWT(
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
		console.log('Calendar api successfully authenticated.');
	}
});

keystone.init({
	"cookie secret": "helloworld",
	"mongo": url,
	"user model": "User",
	"auto update": true,
	"auth": true,
	"name": "KeystoneDB",
	"static": "public",
	"views": "views",
	"view engine":"pug",
});

keystone.import("models");

keystone.set("routes", require("./routes"));

keystone.set("nav", {
	"Pricing":["TheatrePrice", "MembershipPrice", "EquipmentPrice", "IndoorActivityPrice"],
	"Facilities":["Facility", "Facility Options", "Facility Prices"],
    "Bookings":["Bookings","archivedBookings"],
	"Upload Image": "Images",
    "Events": ["Activity","ChildWhatsOn","AdultWhatsOn"],
});

keystone.start();

archiveBookings = require('./routes/booking/archiving.js');
