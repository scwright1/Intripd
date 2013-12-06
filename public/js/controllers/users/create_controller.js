var UsersCreateController = Ember.ObjectController.extend({
  	actions: {
	  	/*registerUser: function() {
	  		var store = this.get('store');
	  		this.get('model').set('id', 1);
	  		this.get('model').set('createdOn', new Date());
	  		var user = store.createRecord('registration', this.get('model'));
	  		user.save();
	 	}*/
	 	registerUser: function() {
	 		var data = this.getProperties('email','password');
	 		var postData = { registration: {email: data.email, password: data.password} };
	 		$.post('/api/auth/register', postData, function(result) {
	 			console.log(result);
	 		});

	 	}
  	}
});

module.exports = UsersCreateController;

