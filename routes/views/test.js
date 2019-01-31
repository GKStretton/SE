var keystone = require("keystone");

module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.section = "test";

	view.query("facility", keystone.list("Facility").model.find());
	view.render("test");
};
