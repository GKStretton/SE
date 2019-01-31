var keystone = require("keystone");
var express = require("express");
var importRoutes = keystone.importer(__dirname);

var apiHandlers = require("./api/test");

var routes = {
	views: importRoutes("./views"),
	booking: importRoutes("./booking"),
};


const bodyParser = require('body-parser');
const session = require('client-sessions'); //cookies

//The order of these is important
exports = module.exports = function (app) {
	// TODO clean
	app.post('/contact-us/submit', function(req,res) {
		sendContactMail('group6.se.durham@gmail.com',
			req.body.name,
			req.body.email,
			req.body.phone,
			req.body.message
		);
		res.end();
	});
	
	app.get('/form',function (req, res) {
	    //res.redirect('form.html');
	    res.render('form-automated');
	});

	app.get('/payment',function (req, res) {
	    paymentData = {
		facility: req.myCookie.booking.facility
	    }
	    res.render('payment/payment-page',paymentData);
	});

	app.get('/payment/success',function (req, res) {
	    res.render('payment/payment-success');
	});




	// TODO sort this out
	
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
	app.post('/booking/executePayment', routes.booking.executePayment);
	app.post('/booking/createPayment', routes.booking.createPayment);
	app.post('/booking/cancelBooking', routes.booking.cancelBooking);
	app.post('/booking/lockRequest', routes.booking.lockRequest);
	app.get('/booking/enquiry/success', routes.booking.success);
	app.post('/booking/enquiry', routes.booking.enquiry);


	app.get("/facilitytest/:name", routes.views.facilitytest);
	app.get("/facility", routes.views.facilitylanding);
	app.get("/facility/:name", routes.views.facility);

	app.get("/event", routes.views.eventlanding);
	app.get("/event/:name", routes.views.event);

	app.get("/api/test", apiHandlers.getTests);

	app.get("/", routes.views.index);
	app.get("/:name", routes.views.base);
};
