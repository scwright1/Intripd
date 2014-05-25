var ApplicationController = Ember.Controller.extend({
	isAuthenticated: function() {
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