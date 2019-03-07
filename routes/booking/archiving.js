/**
This is the file for sceduling cron jobs.
Bookings should be moved to a booking archive.
**/

var schedule = require('node-schedule');
var keystone = require('keystone');

//run every midnight
var archiveBookings = schedule.scheduleJob('0 * * *',moveOldBookings);

//every minute (for testing uncomment below line and comment out above line)
//var archiveBookings = schedule.scheduleJob('0 * * * * *',moveOldBookings);

//archives bookings that are more than a week old
function moveOldBookings(){
    let current = new Date;
    //week old
    current.setDate(current.getDate() -7);
    let weekAgo = current.toISOString();
    keystone.list("Bookings").model.find({endTime:{$lt:weekAgo}},function(err,res){
            if(err){
                return 0;
            }
            res.forEach(function(booking,i){
                let archive = {
                    _id: booking._id,
                    bookingID: booking.bookingID,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    price: booking.price
                }
                keystone.list("archivedBookings").model.create(archive);
                keystone.list("Bookings").model.deleteOne({_id:booking._id},function(err){
                    if(err){
                        console.error(err);
                    }
                });
                keystone.list("Facility").model.findOne({_id:booking.facility},function(err,facility){
                    if(err){
                        console.err(err);
                        return;
                    }
                    calendarFunctions.deleteEvent(facility.calendarId,
                        jwtClient,
                        booking.bookingID);
                });
            });

    });
}

module.exports.archiveBookings = archiveBookings;
