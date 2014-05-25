var token		= require('../helpers/token'),
	User		= require('../models/user');


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
				//create auth token
				var sessionToken = token(user.uid, true);
				//create session
				res.send({
					code: 200,
					token: sessionToken,
					uid: user.uid
				});
			}
		});
	});
}