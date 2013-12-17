var SidebarUserController = App.ApplicationController.extend({
	actions: {
		doSomething: function() {
			alert('i am doing a thing via Button');
		},
		fetchUserProfile: function() {
			//fetch user model
			alert('i am doing a thing via View');
		}
	}
});

module.exports = SidebarUserController;