var keystone = require('keystone');
var Types = keystone.Field.Types;

var FacilityOptions= new keystone.List('Facility Options', {map:{name:"option"}});

FacilityOptions.add({
	facility: {type: Types.Relationship, ref: "Facility", required: true, initial: true},
	option: {type: String, required: false, initial: true},
});

FacilityOptions.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

FacilityOptions.defaultColumns = ["id", "facility", "option"];
FacilityOptions.register();
