var SidebarView = Ember.View.extend({
	didInsertElement: function() {
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

		//animate the menu bar extention
		$('.active-button').click(function() {
			if($(this).hasClass('closed')) {
				$(this).animateRotate(90, 0, 5);
				$(this).removeClass('closed');
				$('#navbar-extended').addClass('extended');
				$('#navbar-extended').animate({'left':'48px'}, {duration: 200, queue: false});
				if($('#content-menu').hasClass('open')) {
					var endpoint = (48 + $('#navbar-extended').width());
					$('#content-menu').animate({'left':endpoint+'px'}, {duration: 200, queue: false});
					var mapleft = (endpoint + $('#content-menu').width());
					$('#map-canvas').animate({'margin-left':mapleft+'px'}, {duration: 200, queue: false});
				} else {
					$('#map-canvas').animate({'margin-left':'152px'}, {duration: 200, queue: false});
				}
			} else {
				$(this).animateRotate(0, 90, 6);
				$(this).addClass('closed');
				$('#navbar-extended').removeClass('extended');
				$('#navbar-extended').animate({'left':'-56px'}, {duration: 200, queue: false});
				if($('#content-menu').hasClass('open')) {
					var endpoint = $('#navbar-vertical').width();
					$('#content-menu').animate({'left':endpoint+'px'}, {duration: 200, queue: false});
					var mapleft = (endpoint + $('#content-menu').width());
					$('#map-canvas').animate({'margin-left':mapleft+'px'}, {duration: 200, queue: false});
				} else {
					var endpoint = $('#navbar-vertical').width() - $('#content-menu').width();
					$('#content-menu').animate({'left':endpoint+'px'}, {duration: 200, queue: false});
					$('#map-canvas').animate({'margin-left':'48px'}, {duration: 200, queue: false});
				}
			}
		});

		$('.menu-item').click(function() {
			if($(this).hasClass('active')) {
				var item = $(this).data('item');
				$(this).removeClass('active');
				$(this).removeClass('menu-item-manual');
				$('.menu-item-text').each(function() {
					if($(this).data('item') == item) {
						$(this).removeClass('active');
						$(this).removeClass('menu-item-text-manual');
					}
				});
				switchContentMenu(item);
			} else {
				//create the relevant classes and activate a menu
				$('.menu-item').each(function() {
					if($(this).hasClass('active')) {
						var item = $(this).data('item');
						$(this).removeClass('active');
						$(this).removeClass('menu-item-manual');
						$('.menu-item-text').each(function() {
							if($(this).data('item') == item) {
								$(this).removeClass('active');
								$(this).removeClass('menu-item-text-manual');
							}
						});
					}
				});
				$(this).addClass('active');
				$(this).addClass('menu-item-manual');
				var item = $(this).data('item');
				$('.menu-item-text').each(function() {
					if($(this).data('item') == item) {
						$(this).addClass('active');
						$(this).addClass('menu-item-text-manual');
					}
				});
				switchContentMenu(item);
			}
		});

		if($('#navbar-extended').hasClass('extended')) {
			$('.menu-item-text').click(function() {
				if($(this).hasClass('active')) {
					var item = $(this).data('item');
					$(this).removeClass('active');
					$(this).removeClass('menu-item-text-manual');
					$('.menu-item').each(function() {
						if($(this).data('item') == item) {
							$(this).removeClass('active');
							$(this).removeClass('menu-item-manual');
						}
					});
					switchContentMenu(item);
				} else {
					//create the relevant classes and activate a menu
					$('.menu-item-text').each(function() {
						if($(this).hasClass('active')) {
							var item = $(this).data('item');
							$(this).removeClass('active');
							$(this).removeClass('menu-item-text-manual');
							$('.menu-item').each(function() {
								if($(this).data('item') == item) {
									$(this).removeClass('active');
									$(this).removeClass('menu-item-manual');
								}
							});
						}
					});
					$(this).addClass('active');
					$(this).addClass('menu-item-text-manual');
					var item = $(this).data('item');
					$('.menu-item').each(function() {
						if($(this).data('item') == item) {
							$(this).addClass('active');
							$(this).addClass('menu-item-manual');
						}
					});
					switchContentMenu(item);
				}
			});
		}

		//animate the hover when the menu bar is extended
		$('.menu-item').each(function() {
			$(this).hover(function() {
				if($('#navbar-extended').hasClass('extended')) {
					var item = $(this).data("item");
					$('.menu-item-text').each(function() {
						if($(this).data("item") == item) {
							$(this).addClass('menu-item-text-manual');
						}
					});
				}
			}, function() {
				if($('#navbar-extended').hasClass('extended')) {
					var item = $(this).data("item");
					$('.menu-item-text').each(function() {
						if($(this).data("item") == item) {
							if(!($(this).hasClass('active'))) {
								$(this).removeClass('menu-item-text-manual');
							}
						}
					});
				}
			});
		});

		//animate the hover on the narrow menu
		if($('#navbar-extended').hasClass('extended')) {
			$('.menu-item-text').each(function() {
				$(this).hover(function() {
					var item = $(this).data("item");
					$('.menu-item').each(function() {
						if($(this).data("item") == item) {
							$(this).addClass('menu-item-manual');
						}
					});
				}, function() {
					var item = $(this).data("item");
					$('.menu-item').each(function() {
						if($(this).data("item") == item) {
							if(!($(this).hasClass('active'))) {
								$(this).removeClass('menu-item-manual');
							}
						}
					});
				});
			});
		}

		function switchContentMenu(menu) {
			//open the menu, switch the content, or close the menu
			if($('#content-menu').hasClass('open')) {
				if($('#content-menu').hasClass(menu+'-menu')) {
					//menu is the same as currently open, so we're closing the menu
					var right;
					if($('#navbar-extended').hasClass('extended')) {
						right = ($('#navbar-extended').position().left + $('#navbar-extended').width());
					} else {
						right = ($('#navbar-vertical').width());
					}
					$('#content-menu').removeClass('open');
					$('#content-menu').removeClass(menu+'-menu');
					var left = right - $('#content-menu').width();
					$('#content-menu').animate({'left':left+'px'},'fast');
					var mapleft = left + $('#content-menu').width();
					$('#map-canvas').animate({'margin-left':mapleft+'px'}, {duration: 200, queue: false});
				} else {
					//menu change
					$('#content-menu').removeClass();
					$('#content-menu').addClass('open');
					$('#content-menu').addClass(menu+'-menu');
				}
			} else {
				//open the menu
				$('#content-menu').addClass('open');
				$('#content-menu').addClass(menu+'-menu');
				var left;
				if($('#navbar-extended').hasClass('extended')) {
					left = ($('#navbar-extended').position().left + $('#navbar-extended').width());
				} else {
					left = ($('#navbar-vertical').width());
				}
				$('#content-menu').animate({'left':left+'px'},{duration: 200, queue: false}); 
				var mapleft = left + $('#content-menu').width();
				$('#map-canvas').animate({'margin-left':mapleft+'px'}, {duration: 200, queue: false});
			}
		}
	}
});

module.exports = SidebarView;