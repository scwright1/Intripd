var ProfileModalController = App.ApplicationController.extend({
	firstName: '',
	lastName: '',
  	actions: {
  		updateInitialProfile: function() {
  			var self = this;
  			var first = self.get('firstName');
  			var last = self.get('lastName');
  			var promise = this.store.find('profile', App.Session.get('uid'));
  			promise.then(fulfill, reject);
  			function fulfill(model) {
  				model.set('firstName', first);
  				model.set('lastName', last);
  				model.set('newUser', false);
  				model.save();
  				this.$('#profile-init').modal('hide');
  			}

  			function reject(reason) {
  				App.Session.reset();
  				this.transitionTo('index');
  			}
  		}
  	}
});

module.exports = ProfileModalController;