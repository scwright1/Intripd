var SidebarUserRoute = Ember.Route.extend({
	init: function() {
		console.log('got here');
	},
	setupController: function(controller, profile) {
		console.log('got into the controller setup');
		controller.set('model', profile);
	},
	model: function() {
		console.log('got into model setup');
		return this.store.find('profile', App.Session.get('uid'));
	},
	renderTemplate: function() {
		this.render('sidebar.user', {outlet: 'sidebar-content'});
	}
});

module.exports = SidebarUserRoute;