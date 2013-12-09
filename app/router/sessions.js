var Session = require('../models/sessionmodel');

module.exports = function(server) {
	server.get('/api/sessions/check', Session.checkSession, function(req, res) {
		res.send(200);
	})
	server.post('/api/sessions/destroy', function(req,res) {
		Session.destroySession(req.body.tokenData, function(response) {
			if(response === 200) {
				res.send(response);
			} else {
				throw response;
			}
		});
	});
}