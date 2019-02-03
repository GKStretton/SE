//query that creates a lock on a slot
//var mongo = require("../../mongo");

module.exports = (req, res) => {
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
                res.status(400).send('Error: The time slot you chose is already booked'); //if the slot is busy
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
                        setTimeout(function () {
                            mongo.deleteEntry(dbo, eventId,"Locks");
                        }, 120000); //delete lock on timeout after 2 minutes
                    }
                });
            }
        }
    });
}
