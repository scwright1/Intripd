var UserRegistration = DS.Model.extend({
	email: DS.attr('string'),
	password: DS.attr('string')
});

module.exports = UserRegistration;