/**
 * User Model
 **/

//require mongoose for mongodb access.  require hash for hashing passwords
var mongoose		= require('mongoose'),
	hash			= require('../helpers/hash'),
	uuid			= require('node-uuid'),
	Profile			= require('./profile');


//create the base user schema
var user_schema = mongoose.Schema({
	provider: {type: String, required: true, default: 'local'}, //auth provider - Local/Facebook/OAuth/Twitter etc
	uid: {type: String, required: true},
	email: {type: String, required: true, unique: true, trim: true, lowercase: true},
	hash: {type: String, required: true},
	salt: {type: String, required: true},
	created: {type: String}
});


//create a static function as part of the schema for signing up
user_schema.statics.register = function(data, done) {
	var User = this;
	hash(data.password, function(err, salt, hash) {
		if(err) {
			return done(10001, null, {message: 'Internal Error, Password hash failed'});
		} else {
			//create user
			User.create({
				email: data.email,
				salt: salt,
				hash: hash,
				uid: uuid.v4(),
				created: new Date()
			}, function(err, user) {
				if(err) {
					return done(10002, null, {message: 'Sorry, That email address is already in use!'});
				} else {
					Profile.create({
						uid : user.uid,
						firstName: data.firstname,
						lastName: data.lastname,
						email: data.email,
                        created : new Date()
					}, function(err) {
						if(err) {
							return done(10003, null, {message: 'Sorry, there has been an error creating your profile!'});
						} else {
							return done(200, user);
						}
					});
				}
			});
		}
	})
};

user_schema.statics.auth = function(email, password, done) {
	this.findOne({email: email}, function(err, user) {
		if(err) {
			return done(20001, null, 'Internal Error.  Please try again.');
		} else {
			if(!user) {
				return done(401, null, "Can't match Email Address");
			} else {
				hash(password, user.salt, function(err, hash) {
					if(err) {
						return done(401, null, err);
					} else {
						if(hash == user.hash) {
							return done(200, user, null);
						} else {
							return done(401, null, 'Invalid Email Address or Password');
						}
					}
				});
			}
		}
	});
};


//create the User model
var User = mongoose.model('User', user_schema);
module.exports = User;
