var IndexController = Ember.ObjectController.extend({
	actions: {
		shift: function(destination) {
			$('html, body').animate({
				scrollTop: $('#'+destination).offset().top - 50
			}, 2000);
		}
	}
});

module.exports = IndexController;