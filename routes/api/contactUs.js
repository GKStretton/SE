var mailer = require("../../mailer.js");
module.exports = (req, res) => {
	mailer.sendContactMail('group6.se.durham@gmail.com',
		req.body.name,
		req.body.email,
		req.body.phone,
		req.body.message
	);

	res.send("ok");
}

