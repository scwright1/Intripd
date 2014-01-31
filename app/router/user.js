var Profile = require('../models/profilemodel');
var Extend = require('../models/extendmodel');
var Session = require('../models/sessionmodel');

module.exports = function(server) {
	server.get('/api/profiles/:id', Session.checkSession, function(req,res) {
		Profile.getProfile(req.params.id, function(response) {
			if(response === 401) {
				res.send(401);
			} else {
				var profile = {
					'profile': response
				};
				res.send(profile);
			}
		});
	});

	//update user profile
	server.put('/api/profiles/:id', Session.checkSession, function(req,res) {
		Profile.updateProfile(req.params.id, req.body, function(response) {
			if(response === 401) {
				res.send(401);
			} else {
				res.send(200);
			}
		});
	});

	server.get('/api/extends/:id', Session.checkSession, function(req,res) {
		Extend.getExtend(req.params.id, function(response) {
			if(response === 401) {
				res.send(response);
			} else {
				var extend = {
					'extend': response
				};
				res.send(extend);
			}
		})
	});

	server.put('/api/extends/:id', Session.checkSession, function(req,res) {
		Extend.updateExtend(req.params.id, req.body, function(response) {
			if(response === 401) {
				res.send(401);
			} else {
				res.send(200);
			}
		});
	})
}