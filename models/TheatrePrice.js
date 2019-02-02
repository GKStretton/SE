var keystone = require('keystone');
var Types = keystone.Field.Types;

var TheatrePrice= new keystone.List('TheatrePrice');

TheatrePrice.add({
	description: {type: Types.Markdown, required:true, initial:true },
	price: { type: String, initial:true, required:true},
});

TheatrePrice.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

TheatrePrice.defaultColumns = 'description';
TheatrePrice.register();
