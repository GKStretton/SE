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
				facility.hasAvailability = false;
				let availability = splitAvailability.splitAvailability(facility.availabilityWeekday);
				if(availability.length != 0){
					facility.availabilityWeekdayStart = availability[0];
					facility.availabilityWeekdayEnd = availability[1];
					facility.hasAvailability = true;
				}
				availability = splitAvailability.splitAvailability(facility.availabilitySaturday);
				if(availability.length != 0){
					facility.availabilitySaturdayStart = availability[0];
					facility.availabilitySaturdayEnd = availability[1];
					facility.hasAvailability = true;
				}
				availability = splitAvailability.splitAvailability(facility.availabilitySunday);
				if(availability.length != 0){
					facility.availabilitySundayStart = availability[0];
					facility.availabilitySundayEnd = availability[1];
					facility.hasAvailability = true;
				}
				if(!facility.hasAvailability)
				{
					facility.automated = false;
				}
				view.render("facility/facility-template", {facility: facility});
			})
		})
	})
}
