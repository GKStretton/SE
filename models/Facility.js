var keystone = require('keystone');
var Types = keystone.Field.Types;

var Facility = new keystone.List('Facility');

Facility.add({
	name: {type: String, required:true, initial:true },
	title: { type: String, required: true, initial: true },
	description: { type: Types.Markdown, required: true, initial: true},
	availability: { type: Types.Markdown, required:true, initial:true},
	pricing: { type: Types.Markdown, required:true,initial:true},
	CostPerHour: { type: Types.Number,initial:true},
	CostPerHalfDay: { type: Types.Number,initial:true},
	CostPerFullDay: { type: Types.Number,initial:true},
});

Facility.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

Facility.defaultColumns = 'title';
Facility.register();
