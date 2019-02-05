var keystone = require('keystone');
var Types = keystone.Field.Types;

var FacilityPrices = new keystone.List('Facility Availability', {map:{name:"_id"}});

FacilityPrices.add({
	facility: {type: Types.Relationship, ref: "Facility", required: true, initial: true},
	day: {type: Types.Select, options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], required: true, initial: true},
	openingHour: {type: Types.Number, required: true, initial: true},
	closingHour: {type: Types.Number, required: true, initial: true}
});

FacilityPrices.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

FacilityPrices.defaultColumns = ["facility", "day", "openingHour", "closingHour"];

FacilityPrices.register();
