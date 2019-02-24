var keystone = require("keystone");

module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	keystone.list("Facility").model.findOne({title:req.params.name}).populate("galleryImages topImage extras").exec((err, facility)=>{
		keystone.list("Facility Options").model.find().where("facility", facility.id).exec((err, options)=>{
			if(options === undefined || options.length != 0){
				facility.options = options;
			}
			keystone.list("Facility Prices").model.find().where("facility", facility.id).exec((err, prices)=>{
				if(prices === undefined || prices.length != 0){
					facility.prices = prices;
				}
				view.render("facility/facility-template", {facility: facility});
			})
		})
	})
}