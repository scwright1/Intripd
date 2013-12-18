var SidebarUserView = Ember.View.extend({
	init: function() {
		var self = this;
		self._super();
	},
	willInsertElement: function() {
		var self = this;
		//self.get('controller').send('fetchUserProfile');
	}
});

module.exports = SidebarUserView;