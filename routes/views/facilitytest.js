var keystone = require("keystone");

module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	view.query("facility", keystone.list("Facility").model.findOne({ name:req.params.name}));
	view.render("facility/facility-test");
};
