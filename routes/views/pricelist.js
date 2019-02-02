var keystone = require("keystone");


module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	view.query("facility", keystone.list("Facility").model.find());
	view.query("theatre", keystone.list("TheatrePrice").model.find());
	view.query("membership", keystone.list("MembershipPrice").model.find());
	view.query("equipment", keystone.list("EquipmentPrice").model.find());
	view.query("indoorActivity", keystone.list("IndoorActivityPrice").model.find());

	view.render("facility/price-list");
}
