var SidebarUserView = Ember.View.extend({
	init: function() {
		var self = this;
		self._super();
	},
	willInsertElement: function() {
		var self = this;
		self.get('controller').set('location', loc);
	},
	didInsertElement: function() {
		FB.getLoginStatus(function(response) {
			if(response.status === 'connected') {
				$('#fb-connect').attr('disabled', 'disabled');
			}
		});
	}
});

module.exports = SidebarUserView;