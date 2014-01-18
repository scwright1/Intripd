var Marker = DS.Model.extend({
	uid: DS.attr('string'),
	name: DS.attr('string'),
	lat: DS.attr('string'),
	lng: DS.attr('string'),
	address: DS.attr('string'),
	creator_uid: DS.attr('string'),
	trip_uid: DS.attr('string')
});

module.exports = Marker;