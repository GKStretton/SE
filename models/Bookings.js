var keystone = require('keystone');
var Types = keystone.Field.Types;

var Bookings = new keystone.List('Bookings');

/** GOOGLE CALENDAR STUFF **/
var {google} = require('googleapis');

var calendarFunctions = require('../googleApiFunctions'); // functions which call google calendar api

//private key from google service account, service acc email also has to be added to each calendar manually
var privatekey = require("../tokens/private-key.json");
// configure a JWT auth client
var jwtClient = new google.auth.JWT(
	privatekey.client_email,
	null,
	privatekey.private_key,
	['https://www.googleapis.com/auth/calendar']);

//authenticate request
jwtClient.authorize(function (err, tokens) {
	if (err) {
		console.log(err);
		return;
	} else {
		console.log('Calendar api successfully authenticated.');
	}
});
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
    facilityID: {type: Types.Relationship,ref:'Facility',initial:true},
    email: {type: String },
    customer_name: {type: String},
    information: {type: String}
});

Bookings.schema.virtual('canAccessKeystone').get(function () {
  return true;
});


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
    mongo.checkBusy(bk.startTime, bk.endTime,bk.facilityID, bk._id, inBookingID, function(err, res){
        let exception = new Error("Could not make a booking at this time");
        if(err){
            next(exception);
            return;
        }
        if(res == 'busy'){
            next(exception);
        }
        else{

            next();
        }
    });
});

//takes in a booking object
//returns a nicer string description to go on the calendar
//note: we won't need the facility name/id here because
//it's intended to go on a calendar which is unique to a facility
function niceCalendarDescription(bk){
        string = 'Customer name: '+ bk.customer_name +'\n' +
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
            //TODO: add update here
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

Bookings.defaultColumns = ['startTime','endTime'];
Bookings.register();
