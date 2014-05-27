var token		= require('../helpers/token'),
	User		= require('../models/user'),
	Session		= require('../models/session');


module.exports = function(server, passport) {
	server.post('/api/authentication/register', function(req, res, next) {
		//sign up user
		User.register(req.body.email, req.body.password, function(error, user, flash) {
			if(error) {
				res.send({
					code: error,
					err: flash.message
				});
			} else {
				req.login(user, function(err) {
					if(err) {
						res.send({err: err});
					} else {
						var SESSIONTOKEN = token(user.uid, req.body.persist);
						var data = {
							token: SESSIONTOKEN
						};
						Session.create(data, function(response, flash) {
							if(response === 200) {
								res.send({
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
}