var keystone = require("keystone");

module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	view.query("adult", keystone.list("AdultWhatsOn").model.find());
	view.query("child", keystone.list("ChildWhatsOn").model.find());

	view.render("whats-on");
}
