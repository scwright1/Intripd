var SidebarUserController = App.ApplicationController.extend({
	actions: {
		doSomething: function() {
		},
		fetchUserProfile: function() {
			//do something
			var mod = this.store.find('profile', App.Session.get('uid'));
			console.log(mod);
		}
	}
});

module.exports = SidebarUserController;