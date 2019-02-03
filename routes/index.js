var keystone = require("keystone");
var express = require("express");


// BACKEND STUFF
calendarId = 'gen9kai518437ib6jc8sq2dsfg@group.calendar.google.com'; // test calendar
lockCalendarId = 'f60vk9un5f4ajucgu5165go8m8@group.calendar.google.com'; // lock calendar
const {google} = require('googleapis');

/**** Rowans API Libraries ****/

calendarFunctions = require('../googleApiFunctions'); // functions which call google calendar api
//const paypalSecret = require("./tokens/paypalSecret.json");
paypalId = require("../tokens/paypalId.json");
paypalApiFunctions = require('../paypalApiFunctions.js');

//private key from google service account, service acc email also has to be added to each calendar manually
privatekey = require("../tokens/private-key.json");
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
        console.log('Calendar api successfully authenticated');
    }
});

var importRoutes = keystone.importer(__dirname);


var routes = {
	views: importRoutes("./views"),
	booking: importRoutes("./booking"),
	api: importRoutes("./api"),
};


const bodyParser = require('body-parser');
const session = require('client-sessions'); //cookies

//The order of these is important
exports = module.exports = function (app) {
	// Middleware

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use( session ({
		cookieName: "myCookie",
		secret: "ucndh34634h48dhsdtywefhsdf7sdf", //some long string used to sign the cookie
		duration: 24 * 60 * 60 * 1000,
		activeDuration: 1000 * 60 * 5 //5 mins
	}));

	app.use(function (req, res, next) {
	    if(typeof req.myCookie.booking == "undefined"){
		req.myCookie.booking = {};
	    }
	    next();
	});


	//app.use("/booking", bookingRouter);

	// TODO use router/make nicer
	app.post('/contact-us/submit', routes.api.contactUs);
	app.post('/booking/executePayment', routes.booking.executePayment);
	app.post('/booking/createPayment', routes.booking.createPayment);
	app.post('/booking/cancelBooking', routes.booking.cancelBooking);
	app.post('/booking/lockRequest', routes.booking.lockRequest);
	app.post('/booking/enquiry', routes.booking.enquiry);


	app.get('/payment',routes.views.payment);
	app.get('/payment/success',routes.views.paymentsuccess);
	app.get('/booking/enquiry/success', routes.booking.success);
	app.get("/availability/:facility", routes.booking.availability);
	app.get('/form', routes.views.form);
	app.get("/facilitytest/:name", routes.views.facilitytest);
	app.get("/facility", routes.views.facilitylanding);
	app.get("/facility/pricelist", routes.views.pricelist);
	app.get("/facility/:name", routes.views.facility);

	app.get("/event", routes.views.eventlanding);
	app.get("/event/:name", routes.views.event);

	app.get("/", routes.views.index);
	app.get("/:name", routes.views.base);
};
