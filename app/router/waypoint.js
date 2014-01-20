var Waypoint = require('../models/waypointmodel');
var Session = require('../models/sessionmodel');

module.exports = function(server) {
	server.post('/api/waypoints', Session.checkSession, function(req,res) {
		Waypoint.Create(req.headers['x-uid'], req.body.waypoint, function(response) {
			if(response == 200) {
				res.send(200);
			} else {
				res.send(400);
			}
		});
	});
}