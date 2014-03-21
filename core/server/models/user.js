/**
 * User Model
 **/

//require mongoose for mongodb access.  require hash for hashing passwords
var mongoose		= require('mongoose');

//create the base user schema
var userSchema = mongoose.Schema({
	provider: {type: String, required: true, default: 'local'}, //auth provider - Local/Facebook/OAuth/Twitter etc
	uid: {type: String, required: true},
	email: {type: String, required: true, unique: true, trim: true, lowercase: true},
	hash: {type: String, required: true},
	salt: {type: String, required: true},
	created: {type: String}
});

//create the User model
var User = mongoose.model('User', userSchema);
module.exports = User;
