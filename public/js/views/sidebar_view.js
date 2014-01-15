var SidebarView = Ember.View.extend({
	didInsertElement: function() {
		//hold entity scope in variable
		var self = this;

		//perform change in controller, called from view
		$('#nb-vert > ul > li').click(function() {
			var controller = self.get('controller');
			controller.set('trigger', this);
			controller.send('navigate');
		});
	}
});

module.exports = SidebarView;