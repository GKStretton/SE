//query that creates a lock on a slot
//var mongo = require("../../mongo");
//TODO - add calendar booking info, get price (you should be able to query via keystone facility "title")
//if it can be done in time - add validation for availability - days of the week based on date
function validateEmail(email) {
    let re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    /*
     * regex above (from http://form.guide/best-practices/validate-email-address-using-javascript.html) checks the formatting of the email
     * does not confirm that the email account exists though
     */
    return re.test(email);
}
module.exports = (req, res) => {
    console.log(req.body.facility);
    if(!validateEmail(req.body.email)){
        res.status(400).send('Error: Invalid email address'); // email address does not conform to the regex above
        return false; // this makes sure to terminate the request - delete/change as you please
    }
    let timeFrom = req.body.timeFrom;
    let timeTo = req.body.timeTo;
    let startTime = req.body.date +'T'+ timeFrom + ":00.0z";
    let endTime = req.body.date +'T'+ timeTo + ":00.0z";
    mongo.checkBusy(startTime,endTime,req.body.facilityId.toString(),'','',function(err,response){
        console.log(response);
        if(err){
            console.log('Check busy error');
            res.status(400).send('Error: We couldn\'t make your booking'); // some sort of error occurs on db's side
            return;
        }
        //make a calendar compatible id
        let bookingId = rfc4122.v1();
         bookingId =  bookingId.replace(/-/g,"");
        if (response == 'busy'){
            console.log('busy');
            res.status(400).send('Error: The time slot you chose is already booked'); // if the slot is busy
            return;
        }
     // if not busy, we lock the slot, the user still needs to pay though
        console.log('Adding lock..');
        mongo.addEntry("Locks", bookingId,startTime,endTime,req.body.facilityId.toString(),0.01,req.body.name,req.body.email,req.body.info,function(err){
            if(err){
                console.log("Add entry error");
                res.status(400).send('Error: We couldn\'t make your booking'); // some sort of error occurs on db's side
                return;
            }
            console.log('200');
            req.myCookie.bookingId =  bookingId;
            res.sendStatus(200); //success
            setTimeout(function(){
                mongo.deleteEntry(bookingId,"Locks");
            }, 120000); //delete lock on timeout after 2 minutes
        });

    });
}
