//query that creates a lock on a slot
//var mongo = require("../../mongo");

function validateEmail(email) {
    let re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    /*
     * regex above (from http://form.guide/best-practices/validate-email-address-using-javascript.html) checks the formatting of the email
     * does not confirm that the email account exists though
     */
    return re.test(email);
}

module.exports = (req, res) => {
    if(!validateEmail(req.body.email)){
        res.status(400).send('Error: Invalid email address'); // email address does not conform to the regex above
        return false; // this makes sure to terminate the request - delete/change as you please
    }
    let timeFrom = req.body.timeFrom;
    let timeTo = req.body.timeTo;
    let startTime = req.body.date +'T'+ timeFrom + ":00.0z";
    let endTime = req.body.date +'T'+ timeTo + ":00.0z";
    mongo.checkBusy(dbo,startTime,endTime,'test_facility',function(err,response){
        console.log(response);
        if(err){
            console.log('Check busy error');
            res.status(400).send('Error: We couldn\'t make your booking'); // some sort of error occurs on db's side
        }
        else{
            let eventId = rfc4122.v1();
            eventId = eventId.replace(/-/g,"");
            req.myCookie.eventID = eventId;
            if (response == 'busy'){
                console.log('busy');
                res.status(400).send('Error: The time slot you chose is already booked'); // if the slot is busy
            }
            else{ // if not busy, we lock the slot, the user still needs to pay though
                console.log('Adding lock..');
                mongo.addEntry("Locks",dbo,eventId,startTime,endTime,'test_facility',0.01,req.body.name,req.body.email,req.body.info,function(err){
                    if(err){
                        console.log("Add entry error");
                        res.status(400).send('Error: We couldn\'t make your booking'); // some sort of error occurs on db's side
                    }
                    else{
                        console.log('200');
                        req.myCookie.booking.eventId = eventId;
                        res.sendStatus(200); //success
                        setTimeout(function(){
                            mongo.deleteEntry(dbo,eventId,"Locks");
                        }, 120000); //delete lock on timeout after 2 minutes
                    }
                });
            }
        }
    });
}
