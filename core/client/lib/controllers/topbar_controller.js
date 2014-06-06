var TopbarController = App.ApplicationController.extend({
	needs: 'map',
	trigger: null,
	start_date: null,
	end_date: null,
	travelling: null,
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
			var map = this.get('controllers.map').get('map');
			if(action === 'open') {
				if($('#menu-content').hasClass('scale')) {
					var leftEdge = $(document).width();
					$('#social-content').css('left', leftEdge+'px');
					$('#menu-content').animate({'width': ($('#menu-content').width() - $('#social-content').width())+'px'}, {duration: 400, queue: false});
					$('#social-content').animate({'left': ($(document).width() - $('#social-content').width())+'px'}, {duration: 400, queue: false});
					$('#map-canvas').animate({'right': $('#social-content').width()+'px'}, {duration: 400, queue: false, step: function() {google.maps.event.trigger(map, 'resize');}});
					$('#social-content').addClass('active');
				} else {
					var leftEdge = $(document).width();
					$('#social-content').css('left', leftEdge+'px');
					$('#social-content').animate({'left': ($(document).width() - $('#social-content').width())+'px'}, {duration: 400, queue: false});
					$('#map-canvas').animate({'right': '300px'}, {duration: 400, queue: false, step: function() {google.maps.event.trigger(map, 'resize');}});
					$('#social-content').addClass('active');
				}
			} else if(action === 'close') {
				if($('#menu-content').hasClass('scale')) {
					$('#menu-content').animate({'width': ($('#menu-content').width() + $('#social-content').width()) + 'px'}, {duration: 400, queue: false})
					$('#social-content').animate({'left': $(document).width()+'px'}, {duration: 400, queue: false});
					$('#map-canvas').animate({'left': $(document).width()+'px'}, {duration: 400, queue: false, step: function() {google.maps.event.trigger(map, 'resize');}});
					$('#map-canvas').animate({'right': '0px'}, {duration: 400, queue: false, step: function() {google.maps.event.trigger(map, 'resize');}});
					$('#social-content').removeClass('active');
				} else {
					$('#social-content').animate({'left': $(document).width()+'px'}, {duration: 400, queue: false});
					$('#map-canvas').animate({'right': '0px'}, {duration: 400, queue: false, step: function() {google.maps.event.trigger(map, 'resize');}});
					$('#social-content').removeClass('active');
				}
			}
		}
	}
});

module.exports = TopbarController;