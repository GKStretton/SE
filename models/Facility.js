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
	availabilityWeekday: {type: String,default:"HH:MM - HH:MM"},
	availabilitySaturday: {type: String,default:"HH:MM - HH:MM"},
	availabilitySunday: {type:String,default:"HH:MM - HH:MM"},
	automated: {type: Boolean},
	extras: {type: Types.Relationship, ref: "EquipmentPrice", many: true},
	topImage: {type: Types.Relationship, ref: "Images",initial:true},
	galleryImages: {type: Types.Relationship, ref: "Images", many: true},
    calendarId:{type:String},
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
    if(!f.topImage){
        next(new Error("Please add at least a top image for the facility"));
    }
    //so we get blocking calendar id creation
    if(!f.initialised){
        f.initialised = true;
        next();
        return;
    }
    if(f.automated){ //check automated facility for availability data
        if(mongo.availStringArray(f.availabilitySunday).length == 0){
            next(new Error("Availability for sunday isn't well formatted"));
        }
        if(mongo.availStringArray(f.availabilityWeekday).length == 0){
            next(new Error("Availability for weekday isn't well formatted"));
        }
        if(mongo.availStringArray(f.availabilitySaturday).length == 0){
            next(new Error("Availability for saturday isn't well formatted"));
        }
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
