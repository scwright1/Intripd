var SidebarTripsRoute = Ember.Route.extend({
	model: function() {
		console.log('hit this model route');
		return this.store.find('trip', {creator_uid: App.Session.get('uid')});
	}
});

module.exports = SidebarTripsRoute;