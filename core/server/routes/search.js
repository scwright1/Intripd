var Session 		= require('../models/session'),
	foursquare		= require('../middleware/foursquare')();
	config			= require('../config')();

module.exports = function(server) {
	server.post('/api/search/foursquare', Session.validate, function(req, res) {
		var data	= req.body.term,
			latlng	= req.body.ll,
			intent	= req.body.intent,
			params;
		if(intent === "browse") {
			params = {
				"ll": 		latlng,
				"radius":	10000,
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

	server.get('/api/search/foursquare', Session.validate, function(req, res) {
		var id = req.query.id,
		params;
		params = {
			venue_id: id
		};
		foursquare.getVenue(params, function(err, venue) {
			if(!err) {
				res.send(200, venue);
			} else {
				res.send(500, err);
			}
		});
	});
}