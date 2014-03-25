var IndexView = Ember.View.extend({
	classNames: ['fill-window'],
	init: function() {
		this._super();
	},
	didInsertElement: function() {
		$('nav').addClass('animated fadeInDown');
		$('.grab-line').addClass('animated fadeInDown');
		$('#splash-progress').addClass('animated fadeInUp');
		$('#splash-progress').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
			$('#splash-progress').removeClass('animated fadeInUp').addClass('animated bounce');
		});

		$('.primary-section').each(function(){
		    var $bgobj = $(this); // assigning the object
		    $(window).scroll(function() {
		        var yPos = -( ($(window).scrollTop() - $bgobj.offset().top) / $bgobj.data('speed'));
		        // Put together our final background position
		        var coords = '50% '+ yPos + 'px';
		        // Move the background
		        $bgobj.css({ backgroundPosition: coords });
		    });
		});

		$('.next-panel').mouseenter(function() {
			$(this).animate({'bottom': '50px'}, 500);
		}).mouseleave(function() {
			$(this).animate({'bottom': '40px'}, 500);
		});
	}
});

module.exports = IndexView;