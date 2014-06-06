var IndexController = Ember.ObjectController.extend({
	actions: {
		shift: function(destination) {
			$("html, body").bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(){
				$('html, body').stop();
			});
			$('html, body').animate({
				scrollTop: $('#'+destination).offset().top
			}, 2000);
		}
	}
});

module.exports = IndexController;