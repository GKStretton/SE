 paypal.Button.render({
	env:'sandbox',//or 'production'
	// Set up a getter to create a Payment ID using the payments api, on your server side:
	payment: function() {
		return new paypal.Promise(function(resolve, reject) {
			// Make an ajax call to get the Payment ID. This should call your back-end,
			// which should invoke the PayPal Payment Create api to retrieve the Payment ID.
			// When you have a Payment ID, you need to call the `resolve` method, e.g `resolve(data.paymentID)`
			// Or, if you have an error from your server side, you need to call `reject`, e.g. `reject(err)`
			jQuery.post('/booking/createPayment')
				.done(function(data) { resolve(data.id); })
				.fail(function(err)  { reject('err'); });
		});
	},
	// Pass a function to be called when the customer approves the payment,
	// then call execute payment on your server:
	onAuthorize: function(data) {
		console.log('The payment was authorized!');
		console.log('Payment ID = ',   data.paymentID);
		console.log('PayerID = ', data.payerID);
		// At this point, the payment has been authorized, and you will need to call your back-end to complete the
		// payment. Your back-end should invoke the PayPal Payment Execute api to finalize the transaction.
		jQuery.post('/booking/executePayment', { paymentID: data.paymentID, payerID: data.payerID })
			.done(function(data) {
                $('#paymentContainer').hide();
                $('#paymentText').html('<p><br>Payment success, check your email for confirmation</p>');
            }) // go to a payment success page
			.fail(function(err)  { console.log("Failed to execute your payment") }); // go to a payment failure page
	},
	// Pass a function to be called when the customer cancels the payment
	onCancel: function(data) {
		console.log('The payment was cancelled!');
		console.log('Payment ID = ', data.paymentID);
	},
	onError: function(){
		console.log("Error");//go to some error page
	}
}, '#paymentContainer');
