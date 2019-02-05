var keystone = require("keystone")

module.exports = (req, res) => {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	view.query("event", keystone.list("Activity").model.findOne({name:req.params.name}));
	
	view.render("event/events");
	//res.render("event/" + req.params.name);
}