var SidebarView = Ember.View.extend({
	didInsertElement: function() {
		var self = this;

		//trigger on click of sidebar element
		$('#sidebar > .menu-item').click(function() {
			//get the sidebar controller
			var controller = self.get('controller');
			//set the trigger in the controller to the current element
			controller.set('trigger', this);
			//activate the menu
			controller.send('activate');
		});

		$(window).resize(function() {
			if($('#menu-content').hasClass('active')) {
				if($('#menu-content').hasClass('scale')) {
					if($('#social-content').hasClass('active')) {
						var width = ($(document).width() - $('#sidebar').width()) - $('#social-content').width();
						$('#menu-content').css('width', width+'px');
						var mapLeft = $(document).width() - $('#social-content').width();
						$('#map-canvas').css('left', mapLeft+'px');
					} else {
						var width = ($(document).width() - $('#sidebar').width());
						$('#menu-content').css('width', width+'px');
						var mapLeft = $(document).width();
						$('#map-canvas').css('left', mapLeft+'px');
					}
				}
			}
		});

	}
});

module.exports = SidebarView;