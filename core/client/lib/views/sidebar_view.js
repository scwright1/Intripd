var SidebarView = Ember.View.extend({
	didInsertElement: function() {
		var self = this;

		//trigger on click of sidebar element
		$('#sidebar > .menu-item').click(function() {
			//get the sidebar controller
			var controller = self.get('controller');
			//get the menu context
			var context = $(this).data('context');

			//set the trigger in the controller to the current element
			controller.set('trigger', this);
			//activate the menu
			controller.send('activate');
		});

	}
});

module.exports = SidebarView;