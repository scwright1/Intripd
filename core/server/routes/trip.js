var Session = require('../models/session');

module.exports = function(server) {
	server.post('/api/trips', Session.validate, function(req, res) {
	});
}