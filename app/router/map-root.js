var Session = require('../models/sessionmodel');

module.exports = function(server) {
	
	//do the authentication on all map routes
	server.all('/api/map/*', Session.checkSession);
}