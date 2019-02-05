var keystone = require('keystone');
var Types = keystone.Field.Types;

var FacilityBasePrices= new keystone.List('Facility Base Prices');

FacilityBasePrices.add({
	facility: {type: Types.Relationship, ref: "Facility", required: true, initial: true},
	option: {type: Types.Relationship, ref: "Facility Options", filters: {facility:":facility"}},
	priceInPencePerHour: {type: Types.Number, initial:true, required:true},
});

FacilityBasePrices.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

FacilityBasePrices.defaultColumns = ["facility", "option", "priceInPencePerHour"];
FacilityBasePrices.register();
