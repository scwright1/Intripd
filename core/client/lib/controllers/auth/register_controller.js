var AuthRegisterController = Em.ObjectController.extend({
	actions: {
		register: function() {
			var self = this;
			var __pwd_check = this.get('password-confirm');
			var __data = this.getProperties('firstname', 'lastname', 'email', 'password');
			if(!__data.firstname || !__data.lastname || !__data.email || !__data.password) {
				this.set('flash', 'You are missing information!');
			} else if(__data.password !== __pwd_check) {
				//todo - passwords don't match
				this.set('flash', "Your passwords do not match!");
			} else {
				//todo - post data to register
				$.post('/api/auth/register', __data).done(function(resp) {
					if(resp.code !== 200) {
						//todo - error registering
					} else {
						//todo - set session tokens
						//todo - retry our attempted Transition if we have one, otherwise drop down to index
					}
				});
			}

		}
	}
});

module.exports = AuthRegisterController;