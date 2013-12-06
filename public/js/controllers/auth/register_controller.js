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
		 			if(response.err) {
		 				self.set('flash', response.err);
		 			} else if(response.success) {
		 				//something
		 			}
		 		});
	 		}
	 	}
  	}
});

module.exports = AuthRegisterController;

