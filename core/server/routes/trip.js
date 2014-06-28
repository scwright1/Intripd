var Trip = require('../models/trip');
var Session = require('../models/session');

module.exports = function(server) {
	server.post('/api/trips', Session.validate, function(req, res) {
		Trip.createTrip(req.headers['x-uid'], req.body.trip, function(code, msg, trip) {
			if(code !== 200) {
				res.send({
					code: code,
					msg: msg
				});
			} else {
				res.send({
					trip: trip
				});
			}
		});
	});

	server.get('/api/trips/:uid', Session.validate, function(req, res) {
		Trip.getTrip(req.params.uid, function(response, data) {
			if(response === 200) {
				var ret = {
					'trip': data
				};
				res.send(ret);
			}
		});
	});

	server.get('/api/trips', Session.validate, function(req, res) {
		Trip.getTrips(req.query.creator_uid, function(response, data) {
			if(response === 200) {
				var ret = {
					'trips': data
				};
				res.send(ret);
			}
		});
	});

	server.delete('/api/trips/:id', Session.validate, function(req, res) {
		Trip.deleteTrip(req.params.id, function(response) {
			res.send(response);
		});
	});

	server.get('/api/trips/data', function(req, res) {
		console.log(req.query);
	});
}