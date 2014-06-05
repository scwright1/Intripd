var AuthLoginController = App.ApplicationController.extend({
	remember: true,
	actions: {
		login: function() {
			var self = this;
			var __data = this.getProperties('email', 'password', 'remember');
			self.set('remember', __data.remember);
			self.set('flash', null);
			if(!__data.email || !__data.password) {
				this.set('flash', 'You are missing information!');
			} else {
				$.post('/api/authentication/login', __data).done(function(response) {
					if(response.code !== 200) {
						self.set('flash', response.err);
					} else {
						App.Session.setProperties({
							user_auth_token: response.token,
							user_uid: response.uid,
							persist: self.get('remember')
						});
				        self.transitionToRoute('index');
					}
				});
			}
		}
	}
});

module.exports = AuthLoginController;