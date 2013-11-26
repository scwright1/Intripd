var AuthLoginController = Ember.ObjectController.extend({
	actions: {
		login: function() {
			var router = this.get('target');
			var data = this.getProperties('email', 'password');
			$.post('auth/login', data, function(results) {
				//App.AuthManager.authenticate(results.api_key.access_token, results.api_key.user_id);
				router.transitionTo('index');
			});
		}
	}	
});

module.exports = AuthLoginController;

