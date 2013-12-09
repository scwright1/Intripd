var mongoose 		= require('mongoose'),
	jwt 			= require('jwt-simple');


var sessionSchema = mongoose.Schema({
	token: 		{ type: String, required: true, unique: true },
	created:  	{ type: Date, default: Date.now }

});

sessionSchema.statics.createSession = function(data, done) {
	var Session = this, t = data.token;
	if(token === '') {
		return done(400, { message: 'Token not found'} );
	} else {
		Session.create({
			token: t
		}, function(err, state) {
			if(err) {
				return done(400, { message: 'Token Malformed'});
			} else {
				return done(200,null);
			}
		});
	}
};

sessionSchema.statics.destroySession = function(data, done) {
	var Session = this, t = data.token;
	if (!token) {
		return done(400);
	} else {
		Session.remove({
			token: t
		}, function(err, response) {
			if(err) {
				return done(400);
			} else {
				return done(200);
			}
		});
	}
};

sessionSchema.statics.checkSession = function(req, res, next) {
	var Session = mongoose.model('Session', sessionSchema), t = req.headers['x-authentication-token'], u = req.headers['x-uid'];
	if((!t) || (!u)) {
		res.send(401);
	} else {
		if(!Session.findOne({token: t})) {
			res.send(401);
		} else {
			var secret = process.env.token_KEY;
			var decode = jwt.decode(t, secret);
			if(decode === u) {
				next();
			} else {
				res.send(401);
			}
		}
	}
};

var Session = mongoose.model('Session', sessionSchema);
module.exports = Session;