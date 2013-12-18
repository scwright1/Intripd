var User = DS.Model.extend({
	email: DS.attr('string'),
	password: DS.attr('string'),
	isChecked: false
});

module.exports = User;

