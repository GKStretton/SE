/*
request functions for the google calendar api
these all require an auth object
in our case, the auth object is our jwtclient(service account)
*/

//checks if busy at certain time, returns 'busy' or 'not busy'
const {google} = require('googleapis');

function checkBusy(startTime, endTime, calendarId, authInput, callback) {
    let response = '';
    let calendar = google.calendar('v3');
    calendar.freebusy.query({ //checks if busy at a certain time
        auth: authInput,
        resource: {
            items: [{
                id: calendarId
            }],
            timeMin: startTime,
            timeMax: endTime,
            timeZone: "Europe/London",
            groupExpansionMax: 1,
            calendarExpansionMax: 1
        }
    }, function(err, response) {
        if (err) {
            callback(err); // we have no way of knowing, so we return busy
        } else {
            for (key in response.data.calendars) {
                if (response.data.calendars[key].busy.length > 0) { // the busy object is non empty if there is a clash
                    callback(false,'busy');
                } else {
                    callback(false,'notBusy')
                }
            }
        }
    });
}

function listEvents(calendarId, authInput) {
    let calendar = google.calendar('v3');
    calendar.events.list({ // lists items from the calendar
        auth: authInput,
        calendarId: calendarId
    }, function(err, response) {
        if (err) {
            console.log(err.code);
            console.log(err.message);
        } else {
            console.log(response.data.items);
        }
    });
}

//attempts to add an event at a certain time window
//uses the checkbusy function to check whether to add the event
//returns true/false based off whether it was able to add the event
function addEvent(startTime, endTime, calendarId,summary, authInput) {
    let calendar = google.calendar('v3');
    checkBusy(startTime, endTime, calendarId, authInput,function(err,response){
        if(err){
            console.log(err.code);
            console.log(err.message);
            return false;
        }
        else{
            if (response == 'busy'){
                console.log('busy');
                return false;
            }
            else{ // if not busy, we can insert the event
                calendar.events.insert({
                    auth: authInput,
                    calendarId: calendarId,
                    resource:{
                        start:{dateTime:startTime,timeZone:'Europe/London'},
                        end: {dateTime:endTime,timeZone:'Europe/London'},
                        summary:summary
                    }  
                },function(err,response){
                    if(err){
                        console.log(err.code);
                        console.log(err.message);
                        return false;
                    }
                    else{
                        console.log('added');
                        return true;
                    }
                });

            }
        }
    }); 
}

module.exports.checkBusy = checkBusy;
module.exports.addEvent = addEvent;