var SidebarUserController = App.ApplicationController.extend({
	needs: 'sidebar',
	w: null,
	trigger: null,
	actions: {
		menu: function() {
			var sidebarController = this.get('controllers.sidebar');
			sidebarController.set('w', this.get('w'));
			sidebarController.set('trigger', this.get('trigger'));
			sidebarController.send('navigate');
		},
		profile: function() {
			return this.store.find('profile', App.Session.get('uid'));
		}.property(),
		initUserProfile: function() {
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