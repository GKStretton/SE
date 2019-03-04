var keystone = require("keystone")

module.exports = (req, res) => {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	locals.enquiry = req.params.query;
	view.render("booking-enquiry");
}