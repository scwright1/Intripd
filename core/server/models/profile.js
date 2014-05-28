var mongoose			= require('mongoose'),
	profile_schema		= mongoose.Schema({
		uid:			{type: String},
		firstName:		{type: String},
		lastName:		{type: String},
		gender:			{type: String},
		dob:			{type: Date},
		created:		{type: Date}
	});

var Profile = mongoose.model('Profile', profile_schema);
module.exports = Profile;