var SidebarController = App.ApplicationController.extend({
	trigger: null,
	actions: {
		activate: function() {
			var element = null;
			element = this.get('trigger');
			//do the element class stuff (i.e. make active/inactive based on state)
			//1.  We click the same element that is already active, so close it
			if($(element).hasClass('active')) {
				$(element).removeClass('active');
				this.send('menu', 'close', this);
			} else {
				//2.  We click a new element when a different element is active
				if($(element).siblings().hasClass('active')) {
					$(element).siblings().removeClass('active');
					$(element).addClass('active');
					this.send('menu', 'change', element);
				} else {
					// 3. No active menu items, just make the current one active
					$(element).addClass('active');
					this.send('menu', 'open', element);
				}
			}
		},
		menu: function(action, trigger) {
			if(action === 'open') {
				if($(trigger).data('scale')) {
					$('#menu-content').addClass('scale');
					if($('#social-content').hasClass('active')) {
						var width = ($(document).width() - $('#sidebar').width()) - $('#social-content').width();
						var menuLeft = $('#sidebar').width() - width;
						$('#menu-content').css('left', menuLeft+'px');
						$('#menu-content').css('width', width+'px');
						var mapLeft = $(document).width();
						$('#menu-content').animate({'left': $('#sidebar').width()+'px'}, {duration: 400, queue: false});
						var mapLeft = $('#social-content').offset().left;
						$('#map-canvas').animate({'left': mapLeft+'px'}, {duration: 400, queue: false, complete: function() {google.maps.event.trigger(map, 'resize');}});
						$('#menu-content').addClass('active');
					} else {
						//preprocess the dimensions of the menu container so we can slide it out
						var width = $(document).width() - $('#sidebar').width();
						var menuLeft = $('#sidebar').width() - width;
						$('#menu-content').css('left', menuLeft+'px');
						$('#menu-content').css('width', width+'px');
						var mapLeft = $(document).width();
						$('#menu-content').animate({'left': $('#sidebar').width()+'px'}, {duration: 400, queue: false});
						$('#map-canvas').animate({'left': mapLeft+'px'}, {duration: 400, queue: false, complete: function() {google.maps.event.trigger(map, 'resize');}});
						$('#menu-content').addClass('active');
					}
				} else {
					var menuLeft = $('#sidebar').width() - $(trigger).data('size');
					$('#menu-content').css('left', menuLeft+'px');
					$('#menu-content').css('width', $(trigger).data('size')+'px');
					var mapLeft = $(trigger).data('size') + $('#sidebar').width();
					$('#menu-content').animate({'left': $('#sidebar').width()+'px'}, {duration: 400, queue: false});
					$('#map-canvas').animate({'left': mapLeft+'px'}, {duration: 400, queue: false, complete: function() {google.maps.event.trigger(map, 'resize');}});
					$('#menu-content').addClass('active');
				}
			} else if(action === 'close') {
				if($('#menu-content').hasClass('scale')){$('#menu-content').removeClass('scale');}
				var menuLeft = $('#sidebar').width() - $('#menu-content').width();
				$('#menu-content').animate({'left': menuLeft+'px'}, {duration: 400, queue: false});
				$('#map-canvas').animate({'left': '80px'}, {duration: 400, queue: false, complete: function() {google.maps.event.trigger(map, 'resize');}});
				$('#menu-content').removeClass('active');
			} else if(action === 'change') {
				console.log('TODO: something clever');
			}
		}
	}
});

module.exports = SidebarController;