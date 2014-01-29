var ApplicationController = Ember.ObjectController.extend({
	needs: 'sidebar.user',
	isAuthenticated: function() {
		return App.Session.isAuthenticated()
	}.property('App.Session.token')
});

module.exports = ApplicationController;