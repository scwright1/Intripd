var TripsRoute = App.AuthenticatedRoute.extend({
	renderTemplate: function() {
		this.render({into: 'map', outlet: 'menu'});
	}
});

module.exports = TripsRoute;