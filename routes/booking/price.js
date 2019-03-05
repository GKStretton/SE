module.exports = (req, res) => {
	console.log(req.query);
	mongo.calcPrice(req.query.facilityId, req.query.timeFrom, req.query.timeTo, function (err, price) {
		if (err) {
			res.status(500).send("Error calculating price for that booking");
		} else {
			res.send(price.toString());
		}
	});
}
