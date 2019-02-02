var keystone = require('keystone');
var Types = keystone.Field.Types;

var Facility = new keystone.List('Facility', {
	map:{name:"title"}
});

var storage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: "public/uploads",
		publicPath: "/public/uploads/",
	}
});

Facility.add({
	name: {type: String, required:true, initial:true, unique:true },
	title: { type: String, required: true, initial: true },
	description: { type: Types.Markdown, required: true, initial: true},
	availability: { type: Types.Markdown, required:true, initial:true},
	pricing: { type: Types.Markdown, required:true,initial:true},
	automated:{type:Boolean, required:true,initial:true},
	CostPerHour: { type: Types.Number,initial:true},
	CostPerHalfDay: { type: Types.Number,initial:true},
	CostPerFullDay: { type: Types.Number,initial:true},
	imageTop: {type: Types.File, storage:storage},
	image1: {type: Types.File, storage:storage},
	image2: {type: Types.File, storage:storage},
	image3: {type: Types.File, storage:storage}
});

Facility.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

Facility.defaultColumns = 'title';
Facility.register();
