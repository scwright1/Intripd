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

session_schema.statics.validate = function(data, done) {
	//todo - check session
};


var Session = mongoose.model('Session', session_schema);
module.exports = Session;