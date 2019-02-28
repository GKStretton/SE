var mailer = require("../../mailer.js");
/*
* checks if lock is still in place, if so, we add the actual booking event
* The event is added first, before we finalise(execute) the payment, this ensures no user ends up paying without a booking on the calendar
* In the event a payment fails to execute, we delete the booking from the calendar
*/
module.exports = (req, res) => {
    //check if lock is still in place
    let bookingId = req.myCookie.bookingId;
    mongo.getLock(bookingId,function(err,lock){
        if(err){ //this means the lock is gone - we have timed out
            console.log(err);
            res.sendStatus(400);
            return;
        }
        mongo.addEntry("Bookings",bookingId,lock.startTime,lock.endTime,lock.facilityID,lock.price,lock.name,lock.email,lock.information,function(err){
            if(err){
                console.log(err);
                res.sendStatus(400);
                return;
            }
            bookingInfo = JSON.stringify(lock); // <-- this needs to be something nicer
            calendarFunctions.addEvent(calendarId,jwtClient,lock.startTime,lock.endTime,bookingInfo,bookingId,function(err){
                if(err){
                    console.log(err.code);
                    console.log(err.message);
                    res.sendStatus(400); // some sort of error occurs on google's side
                }
             //successfully added booking, so we can finalise the payment
                //console.log(req.body);
                paypalApiFunctions.executePayment(
                    paypalId.clientId,
                    "",
                    lock.price,
                    req.body.paymentID,
                    req.body.payerID,
                    function(err,response){
                        if(err){ // payment error, we have to delete the booking
                            console.log(err)
                            res.sendStatus(400);
                            //delete lock event
                            mongo.deleteEntry(bookingId, "Locks");
                            mongo.deleteEntry(bookingId, "Bookings");
                            return;
                        }
                     //payment achieved successfully
                        console.log('Payment executed');
                        res.sendStatus(200);
                        // delete the lock event we no longer need
                        dtString = lock.startTime.toISOString();
                        let lockDate = dtString.slice(0,10);
                        let lockTime = dtString.slice(11,16);
                        mongo.getFacilityName(lock.facilityID,function(facilityName){
                            mailer.sendConfirmationMail('group6.se.durham@gmail.com',lock.email,facilityName,lock.customer_name,lockDate,lockTime,lock.information);
                            mongo.deleteEntry(bookingId, "Locks");
                        });

                    });

            });
        });

    });
}
