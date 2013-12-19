//require mongoose for mongodb access.  require hash for hashing passwords
var mongoose		= require('mongoose'),
    date            = new Date();

//create the base user schema
var profileSchema = mongoose.Schema({
	uid: {type: String},
	firstName: {type: String},
	lastName: {type: String},
	gender: {type: String},
	DOB: {type: String},
	email: {type: String},
	created: {type: String},
	newUser: {type: Boolean, default: true}
});

profileSchema.statics.getProfile = function(data, done) {
	var Profile = mongoose.model('Profile', profileSchema), uid = data;
	if(!uid) {
		return done(401);
	} else {
		Profile.findOne({uid: uid}, function(err, profile) {
			if((err) || (profile === null)) {
				return done(401);
			} else {
				var userProfile = {
					'uid': profile.uid,
					'id': profile._id,
					'email': profile.email,
					'newUser': profile.newUser,
					'firstName': profile.firstName,
					'lastName': profile.lastName
				};
				return done(userProfile);
			}
		});
	}
}

profileSchema.statics.updateProfile = function(id, data, done) {
	var Profile = mongoose.model('Profile', profileSchema);
	if(!id) {
		return done(401);
	} else {
		Profile.update({_id: id}, data.profile, function(){});
		return done(200);
	}
}

//create the User model
var Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;