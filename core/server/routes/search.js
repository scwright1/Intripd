var Session 		= require('../models/session'),
	config			= require('../config'),
	configuration	= config(),
	foursquare		= require('foursquarevenues')(configuration.apps.FOURSQUARE.id, configuration.apps.FOURSQUARE.sec);

module.exports = function(server) {
	server.post('/api/search', Session.validate, function(req, res) {
		var data	= req.body.term,
			latlng	= req.body.ll,
			intent	= req.body.intent,
			params;
		if(intent === "browse") {
			params = {
				"ll": 		latlng,
				"radius":	5000,
				"query":	data,
				"intent":	intent
			};
		} else if(intent === "global") {
			params = {
				"query":	data,
				"intent":	intent
			};
		}
		foursquare.getVenues(params, function(err, venues) {
			if(!err) {
				res.send(200, venues);
			} else {
				res.send(500, err);
			}
		});
	});
}