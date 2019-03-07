/**
This is the file for sceduling cron jobs.
Bookings should be moved to a booking archive.
**/

var schedule = require('node-schedule');
var keystone = require('keystone');

//run every midnight
//var archiveBookings = schedule.scheduleJob('0 * * *',moveOldBookings());

var archiveBookings = schedule.scheduleJob('0 * * * *',moveOldBookings());

//archives bookings that are more than a week old
function moveOldBookings(){
    let current = new Date;
    let currentISO = current.toISOString();
    keystone.list("Bookings").model.find({endTime:{$lt:currentISO}},function(err,res){
            if(err){
                return 0;
            }
            res.forEach(function(booking,i){
                let archive = {
                    bookingID: booking.bookingID,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    price: booking.price
                }
                keystone.list("archivedBookings").model.create(archive);
            });

    });
}

module.exports.archiveBookings = archiveBookings;
