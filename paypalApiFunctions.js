const request = require('request');
//gets an access token we can use for the paypal api
const PAYPAL_URI = "https://api.sandbox.paypal.com";
//creates a paypal payment by making a request to the api
function createPayment(clientId,secret,price,redirectUri,cancelUri,callback){
	request.post({
		uri:PAYPAL_URI + "/v1/payments/payment",
		headers:{
        	"Accept": "application/json",
        	"Accept-Language": "en_US"
		},
		auth:{
			'user': clientId,
			'pass': secret
		},
		body:{
			intent:'sale',
			payer:{
				payment_method:'paypal'
			},
			transactions: [
			{
				amount: 
				{
					total:price,
					currency:'GBP'
				}
			}],
			redirect_urls:
			{
				return_url: redirectUri,
				cancel_url: cancelUri
			}
		},
		json: true
	},function(err,response)
	{
		if(err){
			callback(err);
		}
		else{
			callback(false,response);
		}
	});
}

//executes the payment with a request to the paypal api
function executePayment(clientId,secret,paymentId,payerId,callback){
    request.post(PAYPAL_URI + '/v1/payments/payment/' + paymentId + '/execute',
      {
        auth:
        {
          user: clientId,
          pass: secret
        },
        body:
        {
          payer_id: payerId,
          transactions: [
          {
            amount:
            {
              currency: 'GBP'
            }
          }]
        },
        json: true
      },
      function(err,response){
      	if(err){
      		callback(err)
      	}
      	else{
      		callback(false,response)
      	}
      });
}

module.exports.createPayment = createPayment;
module.exports.executePayment = executePayment;