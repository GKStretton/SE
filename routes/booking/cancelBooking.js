//Is this releasing a lock or deleting an actual booking?
module.exports = (req, res) => {
    deleteEvent(calendarId,jwtClient,req.myCookie.booking.eventId,function(err){
        if(err){
            res.sendStatus(400);
        }
        else{
            res.sendStatus(200);
        }
    });
}
