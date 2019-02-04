var keystone = require('keystone');
var Types = keystone.Field.Types;

var ChildWhatsOn = new keystone.List('ChildWhatsOn');

ChildWhatsOn.add({
	day: {type: String, required:true, initial:true},
	activities:{type:Types.Relationship, ref:"Activity",many:true},
	times:{type:Types.TextArray},
});

ChildWhatsOn.schema.virtual('canAccessKeystone').get(function () {
	return true;
});

ChildWhatsOn.defaultColumns = 'day';
ChildWhatsOn.register();
