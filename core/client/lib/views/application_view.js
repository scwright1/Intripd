var ApplicationView = Ember.View.extend({
	classNames: ['fill-window'],
	didInsertElement: function() {
		//reset cookie notification cookie if it doesn't exist any more
		var cookie_notification = $.cookie('TRP_COOKIENOTIF');
		if(typeof cookie_notification === "undefined") {
			$.cookie('TRP_COOKIENOTIF', true);
		}

		if(cookie_notification === "true" || (typeof cookie_notification === "undefined")) {
			$('#cookies').css('display', 'block');
		} else {
			$('#cookies').css('display', 'none');
		}
	}
});

module.exports = ApplicationView;