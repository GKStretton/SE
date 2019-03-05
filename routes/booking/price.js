module.exports = (req, res) => {
    mongo.calcPrice(req.body.facilityId, req.body.timeFrom, req.body.timeTo, function (err, price) {
        if (err) {
            res.status(500).send("Error calculating price for that booking");
        } else {
            if (price != req.body.price) { //Makes sure that the calculated price is what the user sees.
                res.status(400).send("The calculated price does not match the price given for the booking.");
                return 0;
            }
            res.json(price)
        }
    });
}
