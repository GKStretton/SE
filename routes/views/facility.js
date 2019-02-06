var keystone = require("keystone");

module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	keystone.list("Facility").model.findOne({title:req.params.name}).populate("galleryImages topImage extras").exec((err, facility)=>{
		keystone.list("Facility Options").model.find().where("facility", facility.id).exec((err, options)=>{
			options.forEach(element=>console.log(element.option))
			facility.options = options
			view.render("facility/facility-template", {facility: facility});
		})
	})
}