var SidebarUserRoute = Ember.Route.extend({
	setupController: function(controller) {
		controller.set('model', 'profile');
	}
});

module.exports = SidebarUserRoute;