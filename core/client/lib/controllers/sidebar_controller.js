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
			var size = 0;
			if($(trigger).data('scale') === 'fill') {
				size = $('#map-canvas').width() + $('#sidebar').width();
			} else {
				size = $('#sidebar').width() + 340;
			}
			if(action === 'open') {
				$('#map-canvas').animate({'left': size+'px'}, {duration: 600, queue: false, complete: function() {google.maps.event.trigger(map, 'resize');}});
				$('#menu-content').addClass('active');
				if($('#social-content').hasClass('active')) {
					$('#menu-content').css('right', '300px');
				} else {
					$('#menu-content').css('right', '0px');
				}
			} else if(action === 'close') {
				$('#map-canvas').animate({'left': $('#sidebar').width()+'px'}, {duration: 600, queue: false, complete: function() {google.maps.event.trigger(map, 'resize');}});
				$('#menu-content').removeClass('active');
			} else if(action === 'change') {
				//todo - change menus
			}
		}
	}
});

module.exports = SidebarController;