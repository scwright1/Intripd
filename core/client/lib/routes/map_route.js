var MapRoute = App.AuthenticatedRoute.extend({
	actions: {
		renderMenuElement: function(element, location) {
			this.render(element, {into: location, outlet: 'menu'});
		}
	},
	model: function() {
		return Ember.Object.create({});
	}
});

module.exports = MapRoute;