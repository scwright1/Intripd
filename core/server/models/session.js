var mongoose		= require('mongoose'),
	jwt				= require('jwt-simple'),
	session_schema	= mongoose.Schema({
		token:		{ type: String, required: true, unique: true },
		date:		{ type: Date }
	});

session_schema.statics.generate = function(data, done) {
	var Session = this;
	if(!data.token) {
		return done(400, 'Token not found');
	} else {
		Session.create({
			token: data.token,
			date: new Date()
		}, function(err, state) {
			if(err) {
				return done(400, 'Token Malformed');
			} else {
				return done(200, null);
			}
		});
	}
};

session_schema.statics.destroy = function(data, done) {
	var Session = this;
	if(!data.token) {
		return done(400);
	} else {
		Session.remove({
			token: data.token
		}, function(err) {
			if(err) {
				return done(400);
			} else {
				return done(200)
			}
		});
	}
};

session_schema.statics.validate = function(req, res, next) {
	//todo - check session
	var Session = mongoose.model('Session', session_schema);
	if((!req.headers['x-authentication-token']) || (!req.headers['x-uid'])) {
		res.send(400);
	} else {
		Session.findOne({token: req.headers['x-authentication-token']}, function(err, obj) {
			if((err) || (!obj)) {
				res.send(401);
			} else {
				var decode = jwt.decode(req.headers['x-authentication-token'], process.env.TOKENKEY);
				var now = new Date();
				if((decode.uid !== req.headers['x-uid']) || (decode.exp < now.toJSON())) {
					Session.destroy({token: req.headers['x-authentication-token']}, state);
					res.send(401);
				} else {
					next();
				}
			}
		});
	}
};


var Session = mongoose.model('Session', session_schema);
module.exports = Session;