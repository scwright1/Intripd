var ApplicationController = Ember.ObjectController.extend({
	isAuthenticated: function() {
		console.log(App.Session.isAuthenticated());
		return App.Session.isAuthenticated();
	}.property('App.Session.user_auth_token'),
	actions: {
		closeCookieNotification: function() {
			$.cookie('TRP_COOKIENOTIF', false);
			$('#cookies').css('display', 'none');
		}
	}
});

module.exports = ApplicationController;