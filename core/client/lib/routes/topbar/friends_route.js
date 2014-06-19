var FriendsRoute = App.AuthenticatedRoute.extend({
	renderTemplate: function() {
		this.render({into: 'topbar', outlet: 'menu'});
	}
});

module.exports = FriendsRoute;