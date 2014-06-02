var MapRoute = App.AuthenticatedRoute.extend({
	actions: {
		loadMenu: function(module) {
			this.render(module, {into: 'sidebar', outlet: 'menu-content'});
		}
	},
	model: function() {
		return Ember.Object.create({});
	}
});

module.exports = MapRoute;