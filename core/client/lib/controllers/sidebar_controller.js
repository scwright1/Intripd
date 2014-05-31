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
				this.send('menu', 'close');
			} else {
				//2.  We click a new element when a different element is active
				if($(element).siblings().hasClass('active')) {
					$(element).siblings().removeClass('active');
					$(element).addClass('active');
				} else {
					// 3. No active menu items, just make the current one active
					$(element).addClass('active');
					this.send('menu', 'open');
				}
			}
		},
		menu: function(action) {
			if(action === 'open') {
				$('#map-canvas').animate({'left': '420px'}, {duration: 200, queue: false, complete: function() {google.maps.event.trigger(map, 'resize');}});
			} else if(action === 'close') {
				$('#map-canvas').animate({'left': '80px'}, {duration: 200, queue: false, complete: function() {google.maps.event.trigger(map, 'resize');}});
			}
		}
	}
});

module.exports = SidebarController;