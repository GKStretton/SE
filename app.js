var keystone = require("keystone");
var mongo = require("./mongo.js");
var other = require("./calendar-misc.js");

const url = "mongodb://localhost:4321";

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

keystone.start();
