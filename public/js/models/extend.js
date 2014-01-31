var Extend = DS.Model.extend({
	uid: DS.attr('string'),
	actr: DS.attr('string'),
	aclog: DS.attr('string')
});

module.exports = Extend;