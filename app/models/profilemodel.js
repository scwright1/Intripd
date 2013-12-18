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
	created: {type: String, default: date}
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
					'firstName': 'Steve',
					'lastName': 'Wright'
				};
				return done(userProfile);
			}
		});
	}
}

//create the User model
var Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;