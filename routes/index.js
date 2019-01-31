var keystone = require("keystone");
var express = require("express");
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
	app.get("/facility/:name", routes.views.facility);

	app.get("/event", routes.views.eventlanding);
	app.get("/event/:name", routes.views.event);

	app.get("/", routes.views.index);
	app.get("/:name", routes.views.base);
};

