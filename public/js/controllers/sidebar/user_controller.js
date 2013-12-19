var SidebarUserController = App.ApplicationController.extend({
	actions: {
		doSomething: function() {
			alert('DO SOMETIHGING');
		},
		fetchUserProfile: function() {
			//do something
			console.log(this.get('model'));
		},
		profile: function() {
			return this.store.find('profile', App.Session.get('uid'));
		}.property(),
		initUserProfile: function() {
			//do something
			var promise = this.store.find('profile', App.Session.get('uid'));
			promise.then(fulfill, reject);
			function fulfill(model) {
  				if(model.get('newUser') === true) {
  					//get the user to update their profile
  					this.$('#profile-init').modal('show');
  				}
			}
			function reject(reason) {
				App.Session.reset();
				this.transitionTo('index');
			}
		}
	}
});

module.exports = SidebarUserController;