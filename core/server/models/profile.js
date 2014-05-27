var mongoose			= require('mongoose'),
	profile_schema		= mongoose.Schema({
		uid:			{type: String},
		firstName:		{type: String},
		lastName:		{type: String},
		gender:			{type: String},
		dob:			{type: Date},
		created:		{type: Date},
		userState:		{type: Boolean, default: true}
	});

var Profile = mongoose.model('Profile', profile_schema);
module.exports = Profile;