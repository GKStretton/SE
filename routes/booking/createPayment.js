//creates a paypal payment and sends the id to front end button script
module.exports = (req, res) => {
    console.log(req.myCookie.bookingId);
    mongo.getLock(req.myCookie.bookingId,function(mongoErr,lock){
        console.log(lock);
        if(mongoErr){
            console.log('Mongo error');
            res.sendStatus(400);
            return;
        }
        let price = lock.price;
        price = price.toString();
    	paypalApiFunctions.createPayment(
    		paypalId.clientId,
    		"",//secret
    		price,
    		'https://localhost:3000/payment',
    		'https://localhost:3000/payment',
    		function(err,response){
                if (err) {
    				console.log(err);
                    console.log("Sending");
    				res.sendStatus(400);
    			}
                else {
    			  console.log(response.body);
                  console.log("Created payment");
    				res.json({
    					id:response.body.id
    				});
    			}
    	});
    });
}
