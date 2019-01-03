const {google} = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
var counter = 0; 

apiFunctions = require('./functions');
addEvent = apiFunctions.addEvent;
checkBusy = apiFunctions.checkBusy;
deleteEvent = apiFunctions.deleteEvent;
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

//query that creates a lock on a slot
app.post('/lockRequest',function(req,res){
    calendarId = 'ul3q8rqrmurad3mm8495066r8k@group.calendar.google.com';
    checkBusy(req.body.startTime, req.body.endTime, calendarId, jwtClient,function(err,response){
        if(err){
            console.log(err.code);
            console.log(err.message);
            res.status(400).send('invalid'); // some sort of error occurs on google's side
        }
        else{
            if (response == 'busy'){
                console.log('busy');
                res.status(400).send('busy'); //if the slot is busy
            }
            else{ // if not busy, we lock the slot, the user still needs to pay though
                addEvent(req.body.startTime, req.body.endTime,'loc' + counter.toString(), 'locked',req.body.eventName, jwtClient,function(err){
                    if(err){
                        res.status(400).send('invalid'); // some sort of error occurs on google's side
                    }
                    else{
                        res.sendStatus(200); //success
                    }
                }); 
            }
        }
    }); 

});

app.post('cancelBookingRequest',function(req,res))

app.post('paidBookingRequest')


app.listen(5000);