var SidebarUserView = Ember.View.extend({
	init: function() {
		var self = this;
		self._super();
	},
	willInsertElement: function() {
		var self = this;
		self.get('controller').set('location', loc);
	}
});

module.exports = SidebarUserView;