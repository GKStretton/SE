var keystone = require('keystone');
var Types = keystone.Field.Types;

var MembershipPrice= new keystone.List('MembershipPrice');

MembershipPrice.add({
	description: {type: String, required:true, initial:true },
	price: { type: String, initial:true, required:true},
});

MembershipPrice.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

MembershipPrice.defaultColumns = 'description';
MembershipPrice.register();
