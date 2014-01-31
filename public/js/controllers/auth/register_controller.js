var AuthRegisterController = Ember.ObjectController.extend({
  	actions: {
	 	registerUser: function() {
	 		var confirmpassword = this.get('confirmpassword');
	 		var self = this, data = this.getProperties('email', 'password');
	 		//set the flash to null
	 		self.set('flash', null);

	 		if(data.password !== confirmpassword) {
	 			self.set('flash', 'Passwords do not match.');
	 		} else {
		 		$.post('/api/auth/register', data).then(function(response) {
		 			if(response.code) {
		 				self.set('flash', response.err);
		 			} else if(response.success) {
		 				App.Session.setProperties({
						token: response.token,
						uid: response.uid
						});
						var attemptedTransition = App.Session.get('attemptedTransition');
				        if (attemptedTransition) {
				        	attemptedTransition.retry();
				        	App.Session.set('attemptedTransition', null);
				        } else {
				        	self.transitionToRoute('index');
				        }
		 			}
		 		});
	 		}
	 	}
  	}
});

module.exports = AuthRegisterController;

