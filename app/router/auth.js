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
						session_token = token(user.uid, req.body.isChecked);
						var sessionData = {
							token: session_token
						};
						Session.createSession(sessionData, function(response, flash) {
							if(response === 200) {
								res.send({
									success: true,
									uid: user.uid,
									token: session_token
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
				session_token = token(user.uid, req.body.isChecked);
				var sessionData = {
					token: session_token
				};
				Session.createSession(sessionData, function(response, flash) {
					if(response === 200) {
						res.send({
							success: true,
							uid: user.uid,
							token: session_token
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