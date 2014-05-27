var token		= require('../helpers/token'),
	User		= require('../models/user'),
	Session		= require('../models/session');


module.exports = function(server, passport) {
	server.post('/api/authentication/register', function(req, res, next) {
		//sign up user
		User.register(req.body.email, req.body.password, function(response, user, flash) {
			if(response !== 200) {
				res.send({
					code: response,
					err: flash.message
				});
			} else {
				req.login(user, function(err) {
					if(err) {
						res.send({err: err});
					} else {
						var SESSIONTOKEN = token(user.uid, false);
						var data = {
							token: SESSIONTOKEN
						};
						Session.generate(data, function(response, flash) {
							if(response === 200) {
								res.send({
									code: response,
									uid: user.uid,
									token: SESSIONTOKEN
								});
							} else {
								res.send({
									code: response,
									err: flash
								});
							}
						});
					}
				});
			}
		});
	});


	server.post('/api/authentication/login', function(req, res, next) {
		User.auth(req.body.email, req.body.password, function(response, user, flash) {
			if((response !== 200) || (!user)) {
				res.send({
					code: response,
					err: flash
				});
			} else {
				var SESSIONTOKEN = token(user.uid, req.body.remember);
				var data = {
					token: SESSIONTOKEN
				};
				Session.generate(data, function(response, flash) {
					if(response === 200) {
						res.send({
							code: response,
							uid: user.uid,
							token: SESSIONTOKEN
						});
					} else {
						res.send({
							code: response,
							err: flash
						})
					}
				});
			}
		});
	});

	//blow away the session and log the user out
	server.post('/api/authentication/logout', function(req, res, next) {
		Session.destroy(req.body.__data, function(response) {
			if(response === 200) {
				res.send(200);
			} else {
				throw response;
			}
		});
	});
}