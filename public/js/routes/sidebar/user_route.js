var SidebarUserRoute = Ember.Route.extend({
	beforeModel: function() {
		console.log('doing a thing');
	}
});

module.exports = SidebarUserRoute;