var User = require('../models/usermodel'),
	Session = require('../models/sessionmodel');
	token = require('../helpers/token');

module.exports = function(server, passport) {
	var api_token;
	server.post('/api/auth/register', function(req, res, next) {
		User.signup(req.body.email, req.body.password, function(error, user, flash){
			if(error !== null) {
				res.send({
					err: flash.message
				});
			} else {
				req.login(user, function(error) {
					if(error) {
						res.send({err: error});
					} else {
						api_token = token(user.uid);
						var sessionData = {
							token: api_token,
							uid: user.uid
						};
						Session.createSession(sessionData, function(response, flash) {
							if(response === 200) {
								res.send({
									success: true,
									uid: user.uid,
									token: api_token
								});
							} else {
								res.send({
									code: response,
									err: flash.message
								});
							}
						});
					}
				});
			}
		});
	});

	server.post('/api/auth/login', function(req, res, next) {
		User.authUser(req.body.email, req.body.password, function(error, user, flash) {
			if(error !== null) {
				res.send({err: flash.message});
			} else if(user === false) {
				res.send({
					success: false,
					message: flash.message 
				});
			} else {
				api_token = token(user.uid);
				var sessionData = {
					token: api_token,
					uid: user.uid
				};
				Session.createSession(sessionData, function(response, flash) {
					if(response === 200) {
						res.send({
							success: true,
							uid: user.uid,
							token: api_token
						});
					} else {
						res.send({
							code: response,
							err: flash.message
						});
					}
				});
			}
		});
	});
}