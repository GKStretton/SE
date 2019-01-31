var keystone = require('keystone');
var Types = keystone.Field.Types;

var Test = new keystone.List('Test');

Test.add({
	name: {type:String, required:true,initial:true},
	body: {type:String, required:true,initial:true},
});

Test.schema.virtual('canAccessKeystone').get(function() {
	return true;
});

Test.defaultColumns = 'name, body';
Test.register();
