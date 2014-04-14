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
			var bottom = parseInt($(this).css('bottom'), 10);
			var newBottom = bottom + 10;
			$(this).animate({'bottom': newBottom + 'px'}, 500);
		}).mouseleave(function() {
			var bottom = parseInt($(this).css('bottom'), 10);
			var newBottom = bottom - 10;
			$(this).animate({'bottom': newBottom+'px'}, 500);
		});

		$(document).scroll(function () {
			var sp = $(this).scrollTop();
			if(sp >= $('#feature-2').offset().top) {
				//do feature-2 view logic
				$('#feature-2').find('.feature-content-header').css('display', 'block');
				$('#feature-2').find('.feature-content-header').addClass('animated fadeInLeft');
				setTimeout(function() {
					$('#feature-2').find('.feature-content-desc').css('display', 'block');
					$('#feature-2').find('.feature-content-desc').addClass('animated fadeInLeft');
				}, 500);
			}
		});
	}
});

module.exports = IndexView;