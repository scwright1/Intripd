var TopbarController = App.ApplicationController.extend({
	trigger: null,
	actions: {
		activate: function() {
			var element = null;
			element = this.get('trigger');
			if($(element).hasClass('active')) {
				$(element).removeClass('active');
				this.send('menu', 'close');
			} else {
				$(element).addClass('active');
				this.send('menu', 'open');
			}
		},
		menu: function(action) {
			if(action === 'open') {
				$('#map-canvas').animate({'right': '300px'}, {duration: 200, queue: false, complete: function() {google.maps.event.trigger(map, 'resize');}});
				$('#social-content').addClass('active');
				if($('#menu-content').hasClass('active')) {
					var nw = $('#menu-content').width() - 300;
					$('#map-canvas').css('right', nw);
					$('#menu-content').css('right', '300px');
				}
			} else if(action === 'close') {
				$('#map-canvas').animate({'right': '0px'}, {duration: 200, queue: false, complete: function() {google.maps.event.trigger(map, 'resize');}});
				$('#social-content').removeClass('active');
				if($('#menu-content').hasClass('active')) {
					var nw = $('#menu-content').width() + 300;
					$('#map-canvas').css('left', nw);
					$('#menu-content').css('right', '0px');
				}
			}
		}
	}
});

module.exports = TopbarController;