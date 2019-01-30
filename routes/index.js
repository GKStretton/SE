var keystone = require("keystone");
var importRoutes = keystone.importer(__dirname);

var apiHandlers = require("./api/test");

var routes = {
	views: importRoutes("./views"),
};

//The order of these is important
exports = module.exports = function (app) {
	app.get("/facilitytest/:name", routes.views.facilitytest);
	app.get("/facility", routes.views.facilitylanding);
	app.get("/facility/:name", routes.views.facility);

	app.get("/event", routes.views.eventlanding);
	app.get("/event/:name", routes.views.event);

	app.get("/api/test", apiHandlers.getTests);

	app.get("/", routes.views.index);
	app.get("/:name", routes.views.base);
};
