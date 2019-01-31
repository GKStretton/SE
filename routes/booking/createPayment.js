//creates a paypal payment and sends the id to front end button script
module.exports = (req, res) => {
	paypalApiFunctions.createPayment(
		paypalId.clientId,
		"",
		'0.01',
		'http://localhost:3000/form/payment/success',
		'http://localhost:3000/payment/cancel',
		function(err,response){
			if(err){
				console.log(err);
				res.sendStatus(400);
			}
			else{
			  console.log(response.body);
				res.json({
					id:response.body.id
				});
			}
	})
}
