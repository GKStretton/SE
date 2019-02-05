var keystone = require("keystone")

module.exports = (req, res) => {
	try
	{
		let valid = keystone.list("User").model.findOne().where('_id', req.user._id).exec(function(err, post){
			if(err)
			{
				return res.send("User not valid");
			}
			else
			{
				var view = new keystone.View(req, res);
				var locals = res.locals;
				view.render("booking-admin");
			}
		});
	}
	catch(e)
	{
		return res.send("User not valid");
	}
}