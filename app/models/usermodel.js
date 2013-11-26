/**
 * User Model
 **/

//require mongoose for mongodb access.  require hash for hashing passwords
var mongoose		= require('mongoose'),
	hash 			= require('../helpers/hash');

//create the base user schema
var baseCredentialsSchema = mongoose.Schema({
	provider: {type: String, required: true, default: 'local'},
	uid: {type: String, required: false},
	email: {type: String, required: true, unique: true, trim: true, lowercase: true},
	hash: {type: String, required: true},
	salt: {type: String, required: true},
	created: {type: Date, default: Date.now}
});

//create a static function as part of the schema for signing up
baseCredentialsSchema.statics.signup = function(email, password, done){
        var User = this;
        hash(password, function(err, salt, hash){
                if(err) throw err;
                // if (err) return done(err);
                User.create({
                        email : email,
                        salt : salt,
                        hash : hash
                }, function(err, user){
                        if(err) throw err;
                        // if (err) return done(err);
                        done(null, user);
                });
        });
}

//create a static function to authorize the user
baseCredentialsSchema.statics.authUser = function(email, password, done) {
    this.findOne({email : email}, function(err, user){
            // if(err) throw err;
            if(err) return done(err);
            if(!user) return done(null, false, { message : 'Incorrect email.' });
            hash(password, user.salt, function(err, hash){
                    if(err) return done(err);
                    if(hash == user.hash) return done(null, user);
                    done(null, false, {
                            message : 'Incorrect password'
                    });
            });
    });
};

//create the User model
var User = mongoose.model('User', baseCredentialsSchema);
module.exports = User;
