var mongoose 		= require('mongoose');


var sessionSchema = mongoose.Schema({
	token: 		{ type: String, required: true, unique: true },
	uid: 		{ type: String, required: false },
	created:  	{ type: Date, default: Date.now }

});

sessionSchema.statics.createSession = function(data, done) {
	var Session = this, t = data.token, u = data.uid;
	if(token === '') {
		return done(400, { message: 'Token not found'} );
	} else {
		Session.create({
			token: t,
			uid: u
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
	var Session = this, t = data.token, u = data.uid;
	if (!token) {
		return done(400);
	} else {
		Session.remove({
			token: t,
			uid: u
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
	var Session = mongoose.model('Session', sessionSchema), t = req.headers['x-authentication-token'];
	if(!t) {
		res.send(401);
	} else {
		if(!Session.findOne({token: t})) {
			res.send(401);
		} else {
			next();
		}
	}
};

var Session = mongoose.model('Session', sessionSchema);
module.exports = Session;