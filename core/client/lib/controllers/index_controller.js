var IndexController = Ember.ObjectController.extend({
	actions: {
		shift: function(destination) {
			$('html, body').animate({
				scrollTop: $('#'+destination).offset().top
			}, 2000);
		}
	}
});

module.exports = IndexController;