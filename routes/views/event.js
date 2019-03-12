var keystone = require("keystone")

module.exports = (req, res) => {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	view.query("event", keystone.list("Activity").model.findOne({_id:req.params.id}).populate("galleryImages topImage"));
	view.render("event/events");
}