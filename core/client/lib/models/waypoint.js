var Waypoint = DS.Model.extend({
	name: DS.attr('string'),
	lat: DS.attr('string'),
	lng: DS.attr('string'),
	trip: DS.attr('string')
});

module.exports = Waypoint;