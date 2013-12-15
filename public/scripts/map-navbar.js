$(document).ready(function() {
	$.fn.animateRotate = function(start, angle, margin, duration, easing, complete) {
	    return this.each(function() {
	        var $elem = $(this);

	        $({deg: start}).animate({deg: angle}, {
	            duration: duration,
	            easing: easing,
	            step: function(now) {
	                $elem.css({
	                    transform: 'rotate(' + now + 'deg)'
	                });
	                $elem.css('margin-top', margin+'px');
	            },
	            complete: complete || $.noop
	        });
	    });
	};

	$('.active-button').click(function() {
		if($(this).hasClass('closed')) {
			$(this).animateRotate(90, 0, 5);
			$(this).removeClass('closed');
			$('#navbar-extended').animate({'left':'48px'}, 'fast');
			$('#map-canvas').animate({'margin-left':'152px'}, 'fast');
		} else {
			$(this).animateRotate(0, 90, 6);
			$(this).addClass('closed');
			$('#navbar-extended').animate({'left':'-56px'}, 'fast');
			$('#map-canvas').animate({'margin-left':'48px'}, 'fast');
		}
	});
});