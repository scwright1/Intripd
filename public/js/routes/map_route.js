var MapRoute = App.AuthenticatedRoute.extend({
	actions: {
		loadModule: function(module) {
			this.render(module, {into: 'sidebar', outlet: 'sidebar-content'});
		}
	},
	setupController: function() {
		var model_promise = this.store.find('profile', App.Session.get('uid'));
		var controller = this.controllerFor('sidebar.user');
		controller.set('model', model_promise);
		controller.send('initUserProfile');
	},
	model: function() {
		return Ember.Object.create({});
	}
});

module.exports = MapRoute;