var keystone = require('keystone');
var Types = keystone.Field.Types;

var Facility = new keystone.List('Facility', {
	map:{name:"title"}
});

var storage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: "public/uploads/img",
		publicPath: "/public/uploads/img/",
	}
});

Facility.add({
	title: {type: String, required: true, initial: true, unique: true},
	description: {type: Types.Markdown}, // description
	availabilityWeekday: {type: String},
	availabilitySaturday: {type: String},
	availabilitySunday: {type:String},
	automated: {type: Boolean},
	extras: {type: Types.Relationship, ref: "EquipmentPrice", many: true},
	topImage: {type: Types.Relationship, ref: "Images"},
	galleryImages: {type: Types.Relationship, ref: "Images", many: true},
    calendarId:{type:String,hidden:true},
    initialised: {type: Boolean,hidden:true},
});

Facility.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

Facility.relationship({path:"options", ref: "Facility Options", refPath:"facility"})
Facility.relationship({path:"prices", ref: "Facility Prices", refPath:"facility"})

Facility.defaultColumns = ['title', "automated"];


//if there isn't one already, creates a new calendar and stores the id
Facility.schema.pre('save',function preSave(next){
    let f = this;
    let exception = new Error("Problem making a calendar");
    //so we get blocking calendar id creation
    if(!f.initialised){
        f.initialised = true;
        next();
        return;
    }
    if(!f.calendarId){
        newCalendarId = calendarFunctions.createCalendar(f.title,jwtClient,function(err,newCalendarId){
            if(err){
                next(exception);
                return 0;
            }
            console.log('cal id created: ' + newCalendarId);
            f.calendarId = newCalendarId;
            next();
        });

    }
    else{
        next();
    }
});


//deletes the calendar when the facility is deleted

Facility.schema.pre('remove',function preRemove(next){
    let f = this;
    let exception = new Error("Problem deleting calendar");
    calendarFunctions.deleteCalendar(f.calendarId,jwtClient,function(err){
        if(err){
            next(exception);
        }
        else{
            next();
        }
    });
});

Facility.register();
