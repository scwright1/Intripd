var SidebarView = Ember.View.extend({
	didInsertElement: function() {
		//hold entity scope in variable
		var self = this;

		//perform change in controller, called from view
		$('#nb-vert > ul > li').click(function() {
			var controller = self.get('controller');
			if($(this).data('width') !== null) {
				controller.set('w', $(this).data('width'));
			}
			controller.set('trigger', this);
			controller.send('navigate');
		}); 
	}
});

module.exports = SidebarView;