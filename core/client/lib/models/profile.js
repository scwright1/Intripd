var Profile = DS.Model.extend({
	uid: DS.attr('string'),
	firstName: DS.attr('string'),
	lastName: DS.attr('string'),
	gender: DS.attr('string'),
	DOB: DS.attr('date')
});

module.exports = Profile;