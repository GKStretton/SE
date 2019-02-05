var keystone = require('keystone');
var Types = keystone.Field.Types;

var FacilityPrices = new keystone.List('Facility Prices', {map:{name:"_id"}});

FacilityPrices.add({
	facility: {type: Types.Relationship, ref: "Facility", required: true, initial: true},
	lengthInHours: {type: Types.Number, required: true, initial: true},
	option: {type: Types.Relationship, ref: "Facility Options", filters: {facility:":facility"}},
	priceInGBP: { type: Types.Number, initial:true, required:true},
});

FacilityPrices.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

FacilityPrices.defaultColumns = ["facility", "lengthInHours", "option", "priceInGBP"];

FacilityPrices.register();
