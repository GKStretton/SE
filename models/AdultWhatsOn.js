var keystone = require('keystone');
var Types = keystone.Field.Types;

var AdultWhatsOn = new keystone.List("AdultWhatsOn");

AdultWhatsOn.add({
	day: {type: String, required:true, initial:true},
	activities:{type:Types.Relationship, ref:"Activity",many:true},
	times:{type:Types.TextArray},
});

AdultWhatsOn.schema.virtual('canAccessKeystone').get(function () {
	return true;
});

AdultWhatsOn.defaultColumns = 'day';
AdultWhatsOn.register();
