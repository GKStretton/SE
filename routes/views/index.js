var keystone = require("keystone");

module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	view.query("facilities", keystone.list("Facility").model.find().populate("topImage"));
	keystone.list("Activity").model.find().exec((err,activities)=>{
		// Shuffle array
		const shuffled = activities.sort(() => 0.5 - Math.random());
		// Get sub-array of first n elements after shuffled
		//console.log(shuffled);
		let selected =  shuffled.slice(0, 3);
		locals.activities = selected;
	});
	//locals.act1 = 
	
	//console.log(locals.events);
	view.render("home");
};
