/*
request functions for the google calendar api
these all require an auth object
in our case, the auth object is our jwtclient(service account)
general format is function(calendarId,authInput,[parameters],callback)
*/

//checks if busy at certain time, returns 'busy' or 'notBusy'
const {google} = require('googleapis');
const calendar = google.calendar('v3');
function checkLocked(lockCalendarId, authInput, startTime, endTime,facility,callback) {
    calendar.events.list({ // lists items from the calendar
        auth: authInput,
        calendarId: lockCalendarId,
        timeMin: startTime,
        timeMax:endTime,
    }, function(err, response) {
        if (err) {
            callback(err,true);
        } else {
            let currentTime = new Date();
            for(i = 0; i < response.data.items.length; i++){
                let lockObject = JSON.parse(response.data.items[i].description);
                if (lockObject.facility == facility){
                    let lockTime = parseInt(lockObject.time);
                    if((currentTime.getTime() - lockTime) > 1000 * 60 * 15){
                        callback(false,true);
                        return;
                    }
                    
                }
            }
            callback(false,false);
        }
    });
}

function checkBusy(lockCalendarId,calendarId, authInput, startTime, endTime,facility,callback){
    checkLocked(lockCalendarId, authInput, startTime, endTime,facility,function(err,isLocked){
        if(err){
            callback(err);
        }
        else {
            if(isLocked){
                callback(false,'busy');
            }
            else{
                calendar.events.list({ // lists items from the calendar
                    auth: authInput,
                    calendarId: calendarId,
                    timeMin: startTime,
                    timeMax:endTime,
                }, function(err, response) {
                    if(err){
                        callback(err);
                    }
                    else{
                        for(i = 0; i < response.data.items.length; i++){
                            let booking = JSON.parse(response.data.items[i].description);
                                console.log(booking);
                                if (booking.facility == facility){
                                    callback(false,'busy');
                                    return;
                                }
                        }
                    }    
                    callback(false,'notBusy');
                });
            }
        }

    });
}
function addEvent(calendarId,authInput,startTime,endTime,summary,description,eventId,callback){
    calendar.events.insert({
        auth: authInput,
        calendarId: calendarId,
        resource:{
            start:{dateTime:startTime,timeZone:'Europe/London'},
            end: {dateTime:endTime,timeZone:'Europe/London'},
            summary:summary,
            id: eventId,
            description:description
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
function deleteEvent(calendarId,authInput,eventId,callback){
    calendar.events.delete({
        auth:authInput,
        calendarId:calendarId,
        eventId:eventId
    },function(err,response){
        if(err){
            if(typeof callback === "function"){
                callback(err);
            }   
        }
        else{
            if(typeof callback === "function"){
                callback(false);
            }
        }
    });
}

function getEvent(calendarId,authInput,eventId,callback){
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
module.exports.checkBusy = checkBusy;
module.exports.addEvent = addEvent;
module.exports.deleteEvent = deleteEvent;
module.exports.getEvent  = getEvent;