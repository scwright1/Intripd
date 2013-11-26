Intripd.AuthLoginController = Ember.ObjectController.extend({
	actions: {
		login: function() {
			console.log('hello');
			var data = this.getProperties('email', 'password');
			$.post('auth/login', data, function(res) {
				//do something
			});
		}
	}
});