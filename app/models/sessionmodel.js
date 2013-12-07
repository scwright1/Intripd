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

};

sessionSchema.statics.checkSession = function(data, done) {

};

var Session = mongoose.model('Session', sessionSchema);
module.exports = Session;