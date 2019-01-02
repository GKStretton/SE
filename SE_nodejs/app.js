const {google} = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();


apiFunctions = require('./functions');
addEvent = apiFunctions.addEvent;
checkBusy = apiFunctions.checkBusy;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname,'public')));

const privatekey = require("./private-key.json");
// configure a JWT auth client
var jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/calendar']);

//authenticate request
jwtClient.authorize(function(err, tokens) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log("Successfully connected!");
    }
});
app.get('/form',function(req,res){
    res.redirect('form.html');
});

//test query
app.post('/bookingRequest',function(req,res){
    calendarId = 'ul3q8rqrmurad3mm8495066r8k@group.calendar.google.com';
    checkBusy(req.body.startTime, req.body.endTime, calendarId, jwtClient,function(err,response){
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
                addEvent(req.body.startTime, req.body.endTime, calendarId,'testevent', jwtClient,function(err){
                    if(err){
                        res.sendStatus(400);
                    }
                    else{
                        res.sendStatus(200);
                    }
                }); 
            }
        }
    }); 

});



app.listen(5000);