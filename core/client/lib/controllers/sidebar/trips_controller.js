var TripsController = Ember.ArrayController.extend({
	content: [],
	needs: ['map'],
	name: 'sidebar/trips_controller',
	debug: false
});

module.exports = TripsController;