var SidebarUserView = Ember.View.extend({
	didInsertElement: function() {
		var self = this;
		self._super();
		self.get('controller').send('fetchUserProfile');
	}
});

module.exports = SidebarUserView;