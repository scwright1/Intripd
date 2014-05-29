var mongoose			= require('mongoose'),
	profile_schema		= mongoose.Schema({
		uid:			{type: String},
		firstName:		{type: String},
		lastName:		{type: String},
		gender:			{type: String},
		dob:			{type: Date},
		created:		{type: Date}
	});

profile_schema.statics.getProfileWithID = function(id, done) {
	var Profile = mongoose.model('Profile', profile_schema);
	if(!id) {
		return done(401, null, 'No ID Provided');
	} else {
		Profile.findOne({uid: id}, function(err, profile) {
			if((err) || (!profile)) {
				return done(401, null, 'Possibly '+err+' or no profile found');
			} else {

				var data = {
					'uid': profile.uid,
					'id': profile._id,
					'firstName': profile.firstName,
					'lastName': profile.lastName,
					'gender': profile.gender,
					'dob': profile.dob
				};
				return done(200, data, null);
			}
		});
	}
};

var Profile = mongoose.model('Profile', profile_schema);
module.exports = Profile;