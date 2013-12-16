var MapRoute = App.AuthenticatedRoute.extend({
	actions: {
		loadModule: function(module) {
			//load a valid view template into the view
			this.render(module, {into: 'sidebar', outlet: 'sidebar-content'});
		}
	},
	model: function() {
		return Ember.Object.create({});
	}
});

module.exports = MapRoute;