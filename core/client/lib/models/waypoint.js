var Waypoint = DS.Model.extend({
	sid: DS.attr('string'),
	name: DS.attr('string'),
	lat: DS.attr('string'),
	lng: DS.attr('string')
});

module.exports = Waypoint;