var mongoose		= require('mongoose'),
	jwt				= require('jwt-simple'),
	schema			= mongoose.Schema({
		token:		{ type: String, required: true, unique: true },
		date:		{ type: Date }
	});

schema.statics.create = function(data, done) {
	//todo - create session
};

schema.statics.destroy = function(data, done) {
	//todo - destroy session
};

schema.statics.check = function(data, done) {
	//todo - check session
}


var Session = mongoose.model('Session', schema);
module.exports = Session;