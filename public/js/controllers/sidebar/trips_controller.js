var SidebarTripsController = App.ApplicationController.extend({
	actions: {
		createTrip: function() {
			var trip = this.store.createRecord('trip', {
				creator_uid: App.Session.get('uid'),
				creation_date: new Date()
			});
			trip.save();
		}
	}
});

module.exports = SidebarTripsController;