module.exports = (req, res) => {
	mongo.unavailable(dbo, 1, req.params.facility, function(err, response){
		if (err) {
			res.status(500).send("Error getting availability for that facility" + err)
		} else {
			res.json(response)
		}
	});
};
