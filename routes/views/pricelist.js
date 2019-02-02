var keystone = require("keystone");


module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	view.query("facility", keystone.list("Facility").model.find());
	view.query("theatre", keystone.list("TheatrePrice").model.find());
	view.render("facility/price-list");
}
