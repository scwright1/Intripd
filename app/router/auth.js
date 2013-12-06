var User = require('../models/usermodel');

module.exports = function(server, passport) {
	server.post('/v1/registrations', function(req, res, next) {
		User.signup(req.body.registration.email, req.body.registration.password, function(err, user){
			if(err) throw err;
			req.login(user, function(err){
				if(err) return next(err);
				return res.redirect("/");
			});
		});
	});

	server.post('/api/auth/register', function(req, res, next) {
		User.signup(req.body.registration.email, req.body.registration.password, function(err, user){
			if(err) throw err;
			return res.redirect("/");
		});
	});
}