var MenuController = Ember.Controller.extend({
	isAuthenticated: function() {
		return App.Session.isAuthenticated()
	}.property('App.Session.token')
});

module.exports = MenuController;