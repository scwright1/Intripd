var Session = require('../models/sessionmodel');

module.exports = function(server) {
	
	//do the authentication on all map routes
	server.all('/api/map/*', Session.checkSession);
	server.post('/api/map/data', function(req,res,next) {
		res.send(req.headers['x-authentication-token']);
	});
}