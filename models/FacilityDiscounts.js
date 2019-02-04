var keystone = require('keystone');
var Types = keystone.Field.Types;

var FacilityDiscounts= new keystone.List('Facility Discounts');

FacilityDiscounts.add({
	facility: {type: Types.Relationship, ref: "Facility", required: true, initial: true},
	lengthInHours: {type: Types.Number, required: true, initial: true},
	option: {type: Types.Relationship, ref: "Facility Options", required: false, initial: true, filters: {facility:":facility"}},
	priceInPence: { type: Types.Number, initial:true, required:true},
});

FacilityDiscounts.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

FacilityDiscounts.defaultColumns = ["facility", "lengthInHours", "option", "priceInPence"];

FacilityDiscounts.register();
