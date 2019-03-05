var keystone = require("keystone");
var express = require("express");


// BACKEND STUFF

/**** Rowans API Libraries ****/

calendarFunctions = require('../googleApiFunctions'); // functions which call google calendar api
//const paypalSecret = require("./tokens/paypalSecret.json");
paypalId = require("../tokens/paypalId.json");
paypalApiFunctions = require('../paypalApiFunctions.js');



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
	app.use((req, res, next) => {
		res.view = new keystone.View(req, res);
		keystone.list("Facility").model.find().exec((err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.locals.facilityNav = result;
			}
			next();
		});

	});

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
	app.post('/booking/adminRequest',routes.booking.adminRequest);
	app.get('/booking/price',routes.booking.price);
	app.get("/booking/availability/:facility", routes.booking.availability);
	app.get('/payment',routes.views.payment);
	app.get('/booking/enquiry/success', routes.booking.success);
	app.get('/form', routes.views.form);
	app.get("/facility/price-list", routes.views.pricelist);
	app.get("/facility/parties", routes.views.parties);
	app.get("/facility", routes.views.facilitylanding);
	app.get("/facility/:name", routes.views.facility);
	app.get("/booking-enquiry/:query",routes.views.enquiry)
	app.get("/event", routes.views.eventlanding);
	app.get("/event/:name", routes.views.event);
	app.get("/booking/admin", routes.views.bookingAdmin);
	app.get("/whats-on", routes.views.whatson);
	app.get("/", routes.views.index);
	app.get("/favicon.ico",function(req,res){
		res.sendFile(path.join(__dirname,"favicon.ico"));
	});
	app.get("/:name", routes.views.base);

};
