var AuthLoginController = Ember.ObjectController.extend({
	remember: true,
	actions: {
		login: function() {
			var self = this;
			var __data = this.getProperties('email', 'password', 'remember');
			self.set('flash', null);
			if(!__data.email || !__data.password) {
				this.set('flash', 'You are missing information!');
			} else {
				$.post('/api/authentication/login', __data).done(function(response) {
					if(response.code !== 200) {
						self.set('flash', response.err);
					} else {
						App.Session.set('user_auth_token', response.token);
						App.Session.set('user_uid', response.uid);
						App.Session.set('persist', __data.remember);
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

module.exports = AuthLoginController;