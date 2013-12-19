var Trip = require('../models/tripmodel');
var Session = require('../models/sessionmodel');

module.exports = function(server) {
	server.post('/api/trips', Session.checkSession, function(req,res) {
		Trip.createTrip(req.headers['x-uid'], req.body, function(response) {
			console.log(response);
		});
	});
}