
var keystone = require('keystone');
var Types = keystone.Field.Types;

var IndoorActivityPrice= new keystone.List('IndoorActivityPrice');

IndoorActivityPrice.add({
	description: {type: String, required:true, initial:true },
	junior: { type: String, initial:true, required:true},
	senior: { type: String, initial:true, required:true},
});

IndoorActivityPrice.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

IndoorActivityPrice.defaultColumns = 'description';
IndoorActivityPrice.register();
