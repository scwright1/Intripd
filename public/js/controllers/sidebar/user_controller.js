var SidebarUserController = App.ApplicationController.extend({
	actions: {
		doSomething: function() {
			alert('SOMETHING');
		},
		fetchUserProfile: function() {
			//do something
			var mod = this.store.find('profile', App.Session.get('uid'));
		}
	}
});

module.exports = SidebarUserController;