/**
 * User Model
 **/

//require mongoose for mongodb access.  require hash for hashing passwords
var mongoose		= require('mongoose'),
	hash			= require('../helpers/hash'),
	uuid			= require('node-uuid');


//create the base user schema
var userSchema = mongoose.Schema({
	provider: {type: String, required: true, default: 'local'}, //auth provider - Local/Facebook/OAuth/Twitter etc
	uid: {type: String, required: true},
	email: {type: String, required: true, unique: true, trim: true, lowercase: true},
	hash: {type: String, required: true},
	salt: {type: String, required: true},
	created: {type: String}
});


//create a static function as part of the schema for signing up
userSchema.statics.register = function(email, password, done) {
	var User = this;
	hash(password, function(err, salt, hash) {
		if(err) {
			return done(10001, false, {message: 'Internal Error, Password hash failed'});
		} else {
			//create user
			User.create({
				email: email,
				salt: salt,
				hash: hash,
				uid: uuid.v4(),
				created: new Date()
			}, function(err, user) {
				if(err) {
					return done(10002, false, {message: 'Sorry, That email address is already in use!'});
				} else {
					//create a profile
					done(null, user);
				}
			});
		}
	})
}


//create the User model
var User = mongoose.model('User', userSchema);
module.exports = User;
