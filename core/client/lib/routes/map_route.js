var MapRoute = App.AuthenticatedRoute.extend({
	actions: {
		toggleSidebarMenu: function() {
			var model;
			var sidebar = this.controllerFor('sidebar');
			var trigger = sidebar.get('trigger');
			var context = $(trigger).data('context');
			var module = 'sidebar.'+context;
			var controller = this.controllerFor('sidebar.'+context);
			var modelIdentifier = context.substring(0, context.length -1);
			if($(trigger).data('search')) {
				if($(trigger).data('search') === 'user') {
					model = this.store.find(modelIdentifier, {creator_uid: App.Session.get('user_uid')});
				} else if($(trigger).data('search') === 'trip') {
					model = this.store.find(modelIdentifier, {trip_uid: App.Session.get('user_active_trip')});
				}
				controller.set('model', model);
				//the line below resets the css for this menu
				controller.send('reset');
			}
			this.render(module, {into: 'sidebar', outlet: 'menu-content'});
		},
		toggleTripsMenu: function() {
			var menu = this.controllerFor('sidebar.trips');
			var trigger = menu.get('trigger');
			var controller = this.controllerFor('sidebar.trips.'+trigger);
			controller.send('reset');
			this.render('sidebar.trips.'+trigger, {into: 'sidebar.trips', outlet: 'trip-content'});
		}
	},
	model: function() {
		return Ember.Object.create({});
	}
});

module.exports = MapRoute;