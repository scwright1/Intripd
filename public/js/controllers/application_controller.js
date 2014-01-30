var ApplicationController = Ember.ObjectController.extend({
	needs: 'sidebar.user',
	isAuthenticated: function() {
		return App.Session.isAuthenticated();
	}.property('App.Session.token'),
	profile: function() {
		var user = this.store.find('profile', App.Session.get('uid'));
		return user;
	}.property()
});

module.exports = ApplicationController;