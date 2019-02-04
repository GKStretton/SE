var keystone = require("keystone");

module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	view.query("adult", keystone.list("AdultWhatsOn").model.find());
	view.query("child", keystone.list("ChildWhatsOn").model.find());
	view.query("activity", keystone.list("Activity").model.find());
	locals.getActivityName = function(id,activity){
		for(var i=0;i<activity.length;i++)
		{
			if(activity[i]._id.toString() == id.toString())
			{
				return activity[i].name;
			}
		}
	};
	view.render("whats-on");
}
