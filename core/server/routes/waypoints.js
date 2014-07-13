var Session = require('../models/session');
var Waypoint = require('../models/waypoint');

module.exports = function(server) {
	server.post('/api/waypoints', Session.validate, function(req, res) {
		Waypoint.createWaypoint(req.headers['x-uid'], req.body.waypoint, function(code) {
			if(code !== 200) {
				res.send({
					code: code
				});
			} else {
				res.send(200);
			}
		});
	});

	server.get('/api/waypoints', Session.validate, function(req, res) {
		Waypoint.getWaypoints(req.query.trip, function(code, data) {
			if(code !== 200) {
				res.send({
					code: code,
					msg: data
				});
			} else {
				var ret = {
					'waypoints': data
				};
				res.send(ret);
			}
		});
	});
}