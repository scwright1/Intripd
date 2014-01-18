var SidebarSearchView = Ember.View.extend({
	didInsertElement: function() {
		var controller = this.get('controller');
		$('#location-search-input').focus(function() {
			//start checking
			controller.set('input', this);
			controller.send('search');
		}).blur(function() {
			//end checking
			controller.send('clear');
		});
	}
});

module.exports = SidebarSearchView;