var Session = require('../models/session');

module.exports = function(server) {
	server.post('/api/search', Session.validate, function(req, res) {
		var data = req.body.term;
		console.log(data);
		res.send(200);
	});
}