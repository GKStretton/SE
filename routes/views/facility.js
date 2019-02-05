var keystone = require("keystone");

module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	view.query("facility", keystone.list("Facility").model.findOne({title:req.params.name}).populate("galleryImages topImage extras"));
	view.render("facility/facility-template");
};
