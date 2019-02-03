//creates a paypal payment and sends the id to front end button script
module.exports = (req, res) => {
    console.log(req.myCookie.eventID);
    mongo.getLock(dbo, req.myCookie.eventID,function(mongoErr,lock){
        console.log(lock);
        if(mongoErr){
            console.log('Mongo error');
            res.sendStatus(400);
        }
        else{
        	paypalApiFunctions.createPayment(
        		paypalId.clientId,
        		"",//secret
        		lock.price,
        		'',
        		'',
        		function(err,response){
        			if(err){
        				console.log(err);
                        console.log("Sending");
        				res.sendStatus(400);
        			}
        			else{
        			  console.log(response.body);
                      console.log("Created payment");
        				res.json({
        					id:response.body.id
        				});
        			}
        	});
        }
    });
}
