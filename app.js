keystone = require("keystone");
mongo = require("./mongo.js");
const url = 'mongodb://localhost:4321';
// BACKEND STUFF
const bodyParser = require('body-parser');
path = require('path');
const session = require('client-sessions'); //cookies
const RFC4122 = require('rfc4122'); //unique id for calendar event
rfc4122 = new RFC4122();

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
	"Facilities":["Facility", "Facility Options", "Facility Prices", "Facility Availability"],
	"Upload Image": "Images",
	'Booking': [{label: 'Booking', key: 'booking', path: '/booking/admin'}]
});

keystone.start();
