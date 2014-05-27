var mongoose		= require('mongoose'),
	jwt				= require('jwt-simple'),
	schema			= mongoose.Schema({
		token:		{ type: String, required: true, unique: true },
		date:		{ type: Date }
	});

schema.statics.create = function(data, done) {
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

schema.statics.destroy = function(data, done) {
	//todo - destroy session
};

schema.statics.check = function(data, done) {
	//todo - check session
}


var Session = mongoose.model('Session', schema);
module.exports = Session;