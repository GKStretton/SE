var keystone = require('keystone');
var Types = keystone.Field.Types;

var ChildWhatsOn = new keystone.List('ChildWhatsOn',{
    label: "Child What's On",
});

ChildWhatsOn.add({
	day: {type: String, required:true, initial:true},
	activities:{type:Types.Relationship, ref:"Activity",many:true},
	times:{type:Types.TextArray},
});

ChildWhatsOn.schema.virtual('canAccessKeystone').get(function () {
	return true;
});

ChildWhatsOn.schema.pre('validate',function preVal(next){
    if(this.activities.length != this.times.length){
        next(new Error("There needs to be the same number of times as activities"));
    }
    else{
        next();
    }

});

ChildWhatsOn.defaultColumns = 'day';
ChildWhatsOn.register();
