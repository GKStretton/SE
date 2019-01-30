var keystone = require('keystone');

var Test = keystone.list('Facility').model;

var handlers = {
	getTests: function(req, res) {
		Test.find().exec(function(err, data) {
			if (err) {
				console.log(err);
				res.status(500).send("DB ERROR");
			}

			res.status(200).send(data);
		});
	}
}

module.exports = handlers;
