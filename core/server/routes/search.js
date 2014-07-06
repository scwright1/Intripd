var Session 		= require('../models/session'),
	config			= require('../config'),
	configuration	= config(),
	foursquare		= require('foursquarevenues')(configuration.apps.FOURSQUARE.id, configuration.apps.FOURSQUARE.sec);

module.exports = function(server) {
	server.post('/api/search', Session.validate, function(req, res) {
		var data = req.body.term;
		var latlng = req.body.ll;
		var params = {
			"ll": 		latlng,
			"radius":	5000,
			"query":	data,
			"intent":	"browse"
		};
		foursquare.getVenues(params, function(err, venues) {
			if(!err) {
				res.send(200, venues);
			} else {
				res.send(500, err);
			}
		});
	});
}