var Search = DS.Model.extend({
	sid: DS.attr('string'),
	reference: DS.attr('string'),
	name: DS.attr('string'),
	address: DS.attr('string'),
	lat: DS.attr('string'),
	lng: DS.attr('string')
});


module.exports = Search;