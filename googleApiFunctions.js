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
            console.error('Error making calendar');
            return;
        }
        let calendarId = res.data.id;
        calendar.acl.insert({
            auth:authInput,
            calendarId:calendarId,
            resource: {
                role: 'owner',
                scope: {
                    type:  'user',
                    value: 'group6.se.durham@gmail.com'
                },
            }
        },
        function(err,res){
            callback(calendarId);
        });
    });

}


function addEvent(calendarId,authInput,startTime,endTime,eventId,callback){
    calendar.events.insert({
        auth: authInput,
        calendarId: calendarId,
        resource:{
            start:{dateTime:startTime,timeZone:'Europe/London'},
            end: {dateTime:endTime,timeZone:'Europe/London'},
            summary:'Booking',
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
function updateEvent(calendarId,authInput,startTime,endTime,description,eventId,callback){
    calendar.events.update({
        auth: authInput,
        calendarId: calendarId,
        eventId: eventId,
        resource:{
            start:{dateTime:startTime,timeZone:'Europe/London'},
            end: {dateTime:endTime,timeZone:'Europe/London'},
            description:description,
            summary: 'Booking'
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

module.exports.createCalendar = createCalendar;
module.exports.addEvent = addEvent;
module.exports.deleteEvent = deleteEvent;
module.exports.getEvent  = getEvent;
module.exports.updateEvent = updateEvent;
