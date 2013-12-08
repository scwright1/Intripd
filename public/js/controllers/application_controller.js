var ApplicationController = Ember.ObjectController.extend({
	isAuthenticated: function() {
		return App.Session.isAuthenticated()
	}.property('App.Session.token')
});

module.exports = ApplicationController;