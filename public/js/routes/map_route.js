var MapRoute = App.AuthenticatedRoute.extend({
	actions: {
		loadModule: function(module, needs, model) {
			//load a valid view template into the view
			if(needs === true) {
				this.controllerFor(module).set('model', model);
			}
			this.render(module, {into: 'sidebar', outlet: 'sidebar-content'});
		}
	},
	model: function() {
		return Ember.Object.create({});
	}
});

module.exports = MapRoute;