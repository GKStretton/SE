var keystone = require('keystone');
var Types = keystone.Field.Types;

var Bookings = new keystone.List('Bookings');

//note: the client wants multiple calendars so we might change this
//to have one calendarID per facility

const calendarId = 'gen9kai518437ib6jc8sq2dsfg@group.calendar.google.com';


/** END GOOGLE CALENDAR STUFF **/

console.log('cal id: ' + calendarId);
Bookings.add({
    startTime: {type: Types.Datetime,initial:true}, // description
    bookingID: {type: String, hidden:true,inital: false},
    endTime: {type: Types.Datetime,initial:true},
    price: {type: Number},
    //hopefully should work just by inserting the id in a query
    facility: {type: Types.Relationship,ref:'Facility',initial:true},
    email: {type: String },
    customerName: {type: String},
    information: {type: String}
});

Bookings.schema.virtual('canAccessKeystone').get(function () {
  return true;
});


Bookings.defaultColumns = ['facility','startTime','endTime', 'customerName'];


//pre validate hook, to check manual events for clashes
//This will get checked before any other hooks
Bookings.schema.pre('validate',function preVal(next){
    let bk = this;
    if (!bk.bookingID){
        inBookingID = '';
    }
    else{
        inBookingID = bk.bookingID;
    }
    mongo.bookingValMan(bk.startTime, bk.endTime,bk.facility, bk._id, inBookingID, function(err, res){
        if(err){
            next(new Error(err));
            return;
        }
        next();
    });
});

//takes in a booking object
//returns a nicer string description to go on the calendar
//note: we won't need the facility name/id here because
//it's intended to go on a calendar which is unique to a facility
function niceCalendarDescription(bk){
        string = 'Customer name: '+ bk.customerName +'\n' +
        'Email: ' + bk.email + '\n' +
        'Other information: ' + bk.information + '\n';
        return string;
}

//pre save hook to try and add the event to the calendar
Bookings.schema.pre('save',function preSave(next){
    if (!this.bookingID){
        console.log("setting id..");
        let bookingId = rfc4122.v1();
        bookingId =  bookingId.replace(/-/g,"");
        this.bookingID = bookingId;
    }
    let exception = new Error("Problem adding event to calendar");
    let bk = this;
    calendarFunctions.getEvent(calendarId,jwtClient,bk.bookingID,
        function(err,res){
            //this means it's the first time we are adding
            if(err){
                calendarFunctions.addEvent(
                    calendarId,
                    jwtClient,
                    bk.startTime,
                    bk.endTime,
                    bk.bookingID,
                    function(err){
                        if(err){
                            next(exception);
                        }
                        else{
                            next();
                        }
                    });
                return;
            }
            //the "initial" creation has already made the event, so we now need to update
            let description = niceCalendarDescription(bk);
            console.log(description);
            calendarFunctions.updateEvent(calendarId,
                jwtClient,
                bk.startTime,
                bk.endTime,
                description,
                bk.bookingID,
                function(err){
                    if(err){
                        next(exception);
                    }
                    else{
                        next();
                    }
                });
        });
});

//hook for deletion

Bookings.schema.pre('remove',function preRemove(next){
    let exception = new Error("Problem  deleting event from calendar");
    calendarFunctions.deleteEvent(calendarId,
        jwtClient,
        this.bookingID,
        function(err){
            if(err){
                next();
                //next(exception);
            }
            else{
                next();
            }
        });
});



//Might need to add relationship with facility
//Booking.relationship({path:"options", ref: "Facility Options", refPath:"facility"})

Bookings.register();
