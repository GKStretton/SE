var keystone = require("keystone");

module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	var Facility = keystone.list("Facility");
	var FacilityOptions = keystone.list("Facility Options");
	view.query("facility", Facility.model.findOne({title:req.params.name}).populate("galleryImages topImage extras"));
	view.query("options", FacilityOptions.model.find().populate("facility").where("facility.title", req.params.name));
	console.log(res.locals);
	view.render("facility/facility-template");
}