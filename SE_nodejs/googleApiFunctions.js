/*
request functions for the google calendar api
these all require an auth object
in our case, the auth object is our jwtclient(service account)
general format is function(calendarId,authInput,[parameters],callback)
*/

//checks if busy at certain time, returns 'busy' or 'notBusy'
const {google} = require('googleapis');
const calendar = google.calendar('v3');
function rejectIfLocked(lockCalendarId, authInput, startTime, endTime,facility){
    return new Promise(function(resolve,reject) {
        calendar.events.list({ // lists items from the calendar
            auth: authInput,
            calendarId: lockCalendarId,
            timeMin: startTime,
            timeMax:endTime,
        }, function(err, response) {
            if (err) {
                reject(err);
            } else {
                let currentTime = new Date();
                for(i = 0; i < response.data.items.length; i++){
                    let lockObject = JSON.parse(response.data.items[i].description);
                    if (lockObject.facility == facility){
                        if((currentTime.getTime() - parseInt(lockObject.time)) > 1000 * 60 * 15){
                            reject('busy');
                        }
                        
                    }
                }
                resolve();
            }
        });
    });
}

function checkBusy(calendarId,lockCalendarId, authInput, startTime, endTime,facility,callback){
    rejectIfLocked(lockCalendarId, authInput, startTime, endTime,facility)
        .then(function(){
             calendar.events.list({ // lists items from the calendar
                    auth: authInput,
                    calendarId: calendarId,
                    timeMin: startTime,
                    timeMax: endTime,
                }, function(err, response) {
                    if(err){
                        callback(err);
                    }
                    else{
                        for(i = 0; i < response.data.items.length; i++){
                            let booking = JSON.parse(response.data.items[i].description);
                                if (booking.facility == facility){
                                    callback(false,'busy');
                                    return;
                                }
                        }
                    callback(false,'notBusy');  
                    }

            })
        })
        .catch(function(reason){
            if (reason == 'busy'){
                callback(false,'busy');
            }
            else{
                callback(reason);
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