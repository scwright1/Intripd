var AuthRegisterController = Ember.ObjectController.extend({
  	actions: {
	 	registerUser: function() {
	 		var data = this.getProperties('email','password');
	 		var postData = { registration: {email: data.email, password: data.password} };
	 		$.post('/api/auth/register', postData, function(result) {
	 			console.log(result);
	 		});
	 	}
  	}
});

module.exports = AuthRegisterController;

