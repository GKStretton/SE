/*
request functions for the google calendar api
these all require an auth object
in our case, the auth object is our jwtclient(service account)
general format is function(calendarId,authInput,[parameters],callback)
*/
//checks if busy at certain time, returns 'busy' or 'notBusy'
const {google} = require('googleapis');
const calendar = google.calendar('v3');


function createCalendar(summary,authInput,callback) {
    // Create calendar with given name and share it with the default
    let calendarId = null;
    calendar.calendars.insert({
        auth:authInput,
        resource: {
            summary:summary,
            timeZone: 'Europe/London'
        }
    },
    function(err,res){
        if(err){
            callback('error');
            return 0;
        }
        let calendarId = res.data.id;
        calendar.acl.insert({
            auth:authInput,
            calendarId:calendarId,
            resource: {
                role: 'reader',
                scope: {
                    type:  'user',
                    value: 'group6.se.durham@gmail.com'
                },
            }
        },
        function(err,res){
            if(err){
                callback('error');
                return 0;
            }
            callback(false,calendarId);
        });
    });

}

//deletes a calendar by calendar Id
function deleteCalendar(calendarId,authInput,callback){
    calendar.calendars.delete({
        auth:authInput,
        calendarId: calendarId
    },function(err){
        if (err){
            callback(err);
            return;
        }
            callback(false);
    }
    );

}


function addEvent(calendarId,authInput,startTime,endTime,eventId,bookingDescription,callback){
    calendar.events.insert({
        auth: authInput,
        calendarId: calendarId,
        resource:{
            start:{dateTime:startTime,timeZone:'Europe/London'},
            end: {dateTime:endTime,timeZone:'Europe/London'},
            summary:bookingDescription,
            id: eventId,
        }
    },function(err,response){
        if(err){
            callback(err);
        }
        else{
            callback(false);
        }
    });

}

//update an event
function updateEvent(calendarId,authInput,startTime,endTime,summary,description,eventId,callback){
    calendar.events.update({
        auth: authInput,
        calendarId: calendarId,
        eventId: eventId,
        resource:{
            start:{dateTime:startTime,timeZone:'Europe/London'},
            end: {dateTime:endTime,timeZone:'Europe/London'},
            description:description,
            summary:summary
        }
    },function(err,response){
        if(err){
            callback(err);
        }
        else{
            callback(false);
        }
    });
}

//deletes event with given ID
function deleteEvent(calendarId, authInput, eventId, callback){
    calendar.events.delete({
        auth:authInput,
        calendarId:calendarId,
        eventId:eventId
    },function (err, response) {
        if (err) {
            if (typeof callback === "function") {
                callback(err);
            }
        }
        else{
            if (typeof callback === "function") {
                callback(false);
            }
        }
    });
}

function getEvent(calendarId,authInput,eventId,callback) {
    calendar.events.get({
        auth:authInput,
        calendarId:calendarId,
        eventId:eventId
    }, function(err,response){
        if(err){
            callback(err);
        }
        else{
            callback(false,response);
        }
    });
}

module.exports.deleteCalendar = deleteCalendar;
module.exports.createCalendar = createCalendar;
module.exports.addEvent = addEvent;
module.exports.deleteEvent = deleteEvent;
module.exports.getEvent  = getEvent;
module.exports.updateEvent = updateEvent;
