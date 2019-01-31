module.exports = (req, res) => {
	res.render('payment/payment-page', {facility: req.myCookie.booking.facility});
}
