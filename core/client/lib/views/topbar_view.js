var TopbarView = Ember.View.extend({
	didInsertElement: function() {
		var self = this;
		$('#user-quickbar > .topbar-icon').click(function() {
			var controller = self.get('controller');
			if($(this).data('context')) {
				var context = $(this).data('context');
				controller.set('trigger', this);
				controller.send('activate');
			}
		});
	}
});

module.exports = TopbarView;