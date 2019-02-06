var keystone = require('keystone');
var Types = keystone.Field.Types;

var FacilityAvailability = new keystone.List('Facility Availability');

FacilityAvailability.add({
	facility: {type: Types.Relationship, ref: "Facility", required: true, initial: true},
	day: {type: Types.Select, options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], required: true, initial: true},
	fromHour: {type: Types.Number, required: true, initial: true},
	toHour: {type: Types.Number, required: true, initial: true}
});

FacilityAvailability.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

FacilityAvailability.defaultColumns = ["facility", "day", "fromHour", "toHour"];

FacilityAvailability.register();
