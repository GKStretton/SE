var keystone = require("keystone");


module.exports = (req, res) => {
	var view = new keystone.View(req, res);
	view.query("facilities", keystone.list("Facility").model.find().populate("topImage"))
	view.render("facility/facility-landing");
}
