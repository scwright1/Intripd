var SidebarTripsCreateController = Ember.ObjectController.extend({
	content: [],
	actions: {
		reset: function() {
			var data = this.getProperties('tripname', 'departing', 'returning');
			console.log(data);
		}
	}
});

module.exports = SidebarTripsCreateController;