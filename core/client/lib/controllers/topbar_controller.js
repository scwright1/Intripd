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
			} else if(action === 'close') {
				$('#map-canvas').animate({'right': '0px'}, {duration: 200, queue: false, complete: function() {google.maps.event.trigger(map, 'resize');}});
				$('#social-content').removeClass('active');
			}
		}
	}
});

module.exports = TopbarController;