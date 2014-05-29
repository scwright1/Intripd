var ApplicationController = Ember.ObjectController.extend({
	profile: null,
	isAuthenticated: function() {
		return App.Session.isAuthenticated();
	}.property('App.Session.user_auth_token'),
	profileChanged: function() {
		var self = this;
		var uid = App.Session.get('user_uid');
		if(uid.length > 0) {
			self.store.unloadAll('profile');
			Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
			  if (!jqXHR.crossDomain) {
			    jqXHR.setRequestHeader('X-AUTHENTICATION-TOKEN', App.Session.get('user_auth_token'));
			    jqXHR.setRequestHeader('X-UID', App.Session.get('user_uid'));
			  }
			});
			var user = self.store.find('profile', App.Session.get('user_uid'));
			self.set('profile', user);
		} else {
			self.store.unloadAll('profile');
		}
	}.observes('App.Session.user_uid'),
	profile: function() {
		var user = this.store.find('profile', App.Session.get('user_uid'));
		return user;
	}.property(),
	actions: {
		closeCookieNotification: function() {
			$.cookie('TRP_COOKIENOTIF', false);
			$('#cookies').css('display', 'none');
		}
	}
});

module.exports = ApplicationController;