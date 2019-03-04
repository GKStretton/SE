module.exports = (req, res) => {
    let startTime = nDaysFromNow(1);
    let endTime = nDaysFromNow(60);
	mongo.unavailable(startTime,endTime, req.params.facility, function(err, response){
		if (err) {
			res.status(500).send("Error getting availability for that facility" + err)
		} else {
			res.json(response)
		}
	});
};

//returns date at start of the day, n days from today
function nDaysFromNow(n){
    let d = new Date();
    d.setDate(d.getDate() +n);
    d.setHours(0,0,0,0);
    return d;
}
