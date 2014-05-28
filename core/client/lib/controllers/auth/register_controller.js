var AuthRegisterController = Em.ObjectController.extend({
	actions: {
		register: function() {
			var self = this;
			var __pwd_check = this.get('password-confirm');
			var __data = this.getProperties('firstname', 'lastname', 'email', 'password');
			if(!__data.firstname || !__data.lastname || !__data.email || !__data.password) {
				this.set('flash', 'You are missing information!');
			} else if(__data.password !== __pwd_check) {
				this.set('flash', "Your passwords do not match!");
			} else {
				this.set('flash', null);
				//todo - post data to register
				$.post('/api/authentication/register', __data).done(function(resp) {
					if(resp.code !== 200) {
						//todo - error registering
						self.set('flash', resp.err);
					} else {
						App.Session.setProperties({
							user_auth_token: resp.token,
							user_uid: resp.uid
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