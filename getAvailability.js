/*
 * Takes:
 *  - Facility title (same as in keystone or urls)
 *  - Day of week. A string from (mo|tu|we|th|fr|sa|su)
 *  - A callback function with parameters (start, end)
 * 	 - start = start time (hhmm)
 * 	 - end   = end   time (hhmm)
 *
 * (times are 24hr format)
 *
 * Example usage in a file:
 *
 * =========================================================
 * 
 * var getAvailability = require(**THIS**);
 *
 * ...
 *
 * getAvailability("Astro Turf", "su", (start, end) => {
 * 	console.log(start);
 * 	console.log(end);
 * });
 *
 * =========================================================
 *
 *     /\
 *    /||\
 *     ||
 *     ||
 *
 *   Prints, e.g. "1000" & "1230"
 */

var keystone = require("keystone");

module.exports = (facility, day, callback) => {
	keystone.list("Facility").model.findOne({title:facility}).exec(function(err, posts) {
		// Intuitively => (hh):(mm)-(hh):(mm) allowing for whitespace
		var re = new RegExp("\\s*([0-9]{1,2})\\s*:\\s*([0-9]{1,2})\\s*-\\s*([0-9]{1,2})\\s*:\\s*([0-9]{1,2})");
		var result;

		switch (day) {
		case "mo": case "tu": case "we": case "th": case "fr":
			result = re.exec(posts.availabilityWeekday);
			break;
		case "sa":
			result = re.exec(posts.availabilitySaturday);
			break;
		case "su":
			result = re.exec(posts.availabilitySunday);
			break;
		default:
			result = ["", "99", "99", "99", "99"];
		}

		callback(result[1] + result[2], result[3] + result[4]);
	});
}
