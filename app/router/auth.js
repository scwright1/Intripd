var User = require('../models/usermodel');

module.exports = function(server, passport) {
	server.post('/api/auth/register', function(req, res, next) {
		User.signup(req.body.email, req.body.password, function(error, user, flash){
			if(error !== null) {
				res.send({
					err: flash.message
				});
			} else {
				res.send({
					success: true,
					token: 'OK'
				});
			}
		});
	});

	server.post('/api/auth/login', function(req, res, next) {
		api_token = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		User.authUser(req.body.email, req.body.password, function(error, user, flash) {
			if(error !== null) {
				res.send({err: flash.message});
			} else if(user === false) {
				res.send({
					success: false,
					message: flash.message 
				});
			} else {
				res.send({
					success: true,
					token: api_token
				});
			}
		});
	});
}