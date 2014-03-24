var ApplicationController = Ember.Controller.extend({
	actions: {
		closeCookieNotification: function() {
			$.cookie('TRP_COOKIENOTIF', false);
			$('#cookies').css('display', 'none');
		}
	}
});

module.exports = ApplicationController;