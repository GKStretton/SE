var keystone = require('keystone');
var Types = keystone.Field.Types;

var Bookings = new keystone.List('Bookings',{
  map: { name: 'summary' },
  defaultSort: '-startTime'
});

Bookings.add({
    summary:{type: String, initial: true},
    startTime: {type: Types.Datetime,initial:true,parseFormat:'YYYY-MM-DD HH:mm Z'}, // description
    bookingID: {type: String, hidden:true,inital: false},
    endTime: {type: Types.Datetime,initial:true,parseFormat:'YYYY-MM-DD HH:mm Z'},
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


Bookings.defaultColumns = ['summary','facility','startTime','endTime', 'customerName'];


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
    keystone.list("Facility").model.findOne({_id:bk.facility},function(err,facility){
        if(err){
            next(new Error(err));
            return;
        }
        if(facility.automated){
            mongo.bookingValMan(bk.startTime, bk.endTime,bk.facility, bk._id, inBookingID, function(err, res){
                if(err){
                    next(new Error(err));
                    return;
                }
                next();
            });
        }
        else{//we don't check
            next();
        }
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
    keystone.list("Facility").model.findOne({_id:bk.facility},function(err,facility){
        if(err){
            next(exception);
            return;
        }
        calendarFunctions.getEvent(facility.calendarId,jwtClient,bk.bookingID,
            function(err,res){
                //this means it's the first time we are adding
                if(err){
                    calendarFunctions.addEvent(
                        facility.calendarId,
                        jwtClient,
                        bk.startTime,
                        bk.endTime,
                        bk.bookingID,
                        bk.summary,
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
                let nice_description = niceCalendarDescription(bk);
                calendarFunctions.updateEvent(facility.calendarId,
                    jwtClient,
                    bk.startTime,
                    bk.endTime,
                    bk.summary,
                    nice_description,
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
});

//hook for deletion

Bookings.schema.pre('remove',function preRemove(next){
    let exception = new Error("Problem  deleting event from calendar");
    let bk = this;
    keystone.list("Facility").model.findOne({_id:bk.facility},function(err,facility){
        if(err){
            next(exception);
            return;
        }
        calendarFunctions.deleteEvent(facility.calendarId,
            jwtClient,
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



//Might need to add relationship with facility
//Booking.relationship({path:"options", ref: "Facility Options", refPath:"facility"})

Bookings.register();
