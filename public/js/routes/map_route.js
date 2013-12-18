var MapRoute = App.AuthenticatedRoute.extend({
	actions: {
		loadModule: function(module) {
			this.render(module, {into: 'sidebar', outlet: 'sidebar-content'});
		}
	},
	setupController: function(controller, profile) {
		var model = this.store.find('profile', App.Session.get('uid'));
		var controller = this.controllerFor('sidebar.user');
		controller.set('content', model);
		console.log(model);
	},
	model: function() {
		return Ember.Object.create({});
	}
});

module.exports = MapRoute;