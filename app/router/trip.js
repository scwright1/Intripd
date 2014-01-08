var Trip = require('../models/tripmodel');
var Session = require('../models/sessionmodel');

module.exports = function(server) {
	server.post('/api/trips', Session.checkSession, function(req,res) {
		Trip.createTrip(req.headers['x-uid'], req.body.trip, function(response, trip) {
			if(response === 200) {
				res.send({'trip': trip});
			}
		});
	});

	server.get('/api/trips', Session.checkSession, function(req, res) {
		Trip.getTrips(req.query.creator_uid, function(response, data) {
			if(response === 200) {
				var ret = {
					'trips': data
				};
				console.log(ret);
				res.send(ret);
			}
		});
	});
}