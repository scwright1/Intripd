/**
 * User Model
 **/

//require mongoose for mongodb access.  require hash for hashing passwords
var mongoose		= require('mongoose'),
	hash 			= require('../helpers/hash'),
    uuid            = require('node-uuid'),
    date            = new Date();

//create the base user schema
var baseCredentialsSchema = mongoose.Schema({
	provider: {type: String, required: true, default: 'local'},
	uid: {type: String, default: uuid.v4()},
	email: {type: String, required: true, unique: true, trim: true, lowercase: true},
	hash: {type: String, required: true},
	salt: {type: String, required: true},
	created: {type: String, default: date}
});

//create a static function as part of the schema for signing up
baseCredentialsSchema.statics.signup = function(email, password, done){
    var User = this;
    hash(password, function(err, salt, hash){
        if (err) {
            return done(10001, false, {message: 'Internal Error: Password Hash Failed'});
        } else {
            User.create({
                email : email,
                salt : salt,
                hash : hash
            }, function(err, user){
                if (err) {
                    return done(11000, false, {message: 'Email address is already in use.'});
                } else {
                    done(null, user);
                }
            });
        }
    });
}

//create a static function to authorize the user
baseCredentialsSchema.statics.authUser = function(email, password, done) {
    this.findOne({email : email}, function(err, user){
        if(err) {
            return done(20001, false, {message: 'Internal Error'});
        }
        if(!user) {
            return done(null, false, { message : 'Incorrect email.' });
        }
        hash(password, user.salt, function(err, hash){
            if(err) {
                return done(err);
            }
            if(hash == user.hash) {
                return done(null, user);
            } else {
                return done(null, false, {message : 'Incorrect password.'});
            }
        });
    });
};

//create the User model
var User = mongoose.model('User', baseCredentialsSchema);
module.exports = User;
