mailer = require("../../mailer.js");
/*
* checks if lock is still in place, if so, we add the actual booking event
* The event is added first, before we finalise(execute) the payment, this ensures no user ends up paying without a booking on the calendar
* In the event a payment fails to execute, we delete the booking from the calendar
*/
module.exports = (req, res) => {
    //check if lock is still in place
    mongo.getLock(dbo,req.myCookie.booking.eventId,function(err,lock){
        if(err){ //this means the lock is gone - we have timed out
            console.log(err);
            res.sendStatus(400);
        }
        else{
            
            bookingInfo= JSON.stringify(lock);
            //Ideally we do something to add the entry to the database here - Erdal.
            mongo.addEntry("Bookings",dbo,lock.eventID,lock.startTime,lock.endTime,lock.facilityID,lock.price,lock.email,lock.information,function(err){
                if(err){
                    console.log(err);
                    res.sendStatus(400);
                }
                else{
                    calendarFunctions.addEvent(calendarId, jwtClient,lock.startTime, lock.endTime,bookingInfo,lock.eventID,function(err){
                            if(err){
                                console.log(err.code);
                                console.log(err.message);
                                res.sendStatus(400); // some sort of error occurs on google's side
                            }
                            else{ //successfully added booking, so we can finalise the payment
                                console.log(req.body);
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
                                            calendarFunctions.deleteEvent(lockCalendarId,jwtClient,req.myCookie.booking.eventId);
                                            calendarFunctions.deleteEvent(calendarId,jwtClient,eventId);
                                        }
                                        else{//payment achieved successfully
                                            console.log('Payment executed');
                                            res.sendStatus(200);
                                            // delete the lock event we no longer need
                                            calendarFunctions.deleteEvent(lockCalendarId,jwtClient,req.myCookie.booking.eventId);
                                            let r = req.myCookie.booking;
                                            mailer.sendConfirmationMail('group6.se.durham@gmail.com',r.email,r.facility,r.name,r.date,r.time,r.info);
                                        }
                                    });
                            }
                    });
                }
            });

        }
    });
}
