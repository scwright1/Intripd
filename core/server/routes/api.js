var config = require('../config')();

module.exports = function(server) {
	server.get('/api', function(req, res) {
		res.send(200, {foursquare: config.apps.FOURSQUARE.calls});
	});
};