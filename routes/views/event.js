var keystone = require("keystone")

module.exports = (req, res) => {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	view.query("event", keystone.list("Activity").model.findOne({name:req.params.name}).populate("galleryImages topImage"));
	view.render("event/events");
}