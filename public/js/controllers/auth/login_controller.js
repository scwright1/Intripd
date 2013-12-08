var AuthLoginController = Ember.ObjectController.extend({
	isChecked: false,
	actions: {
		login: function() {
			var self = this, data = this.getProperties('email', 'password', 'isChecked');
			//set the flash message to null
			self.set('flash', null);
			$.post('/api/auth/login', data).then(function(response) {
				if(response.err) {
					self.set('flash', response.err);
				} else if(response.success) {
					App.Session.setProperties({
						token: response.token,
						uid: response.uid,
						rem: data.isChecked
					});
					var attemptedTransition = App.Session.get('attemptedTransition');
			        if (attemptedTransition) {
			        	attemptedTransition.retry();
			        	App.Session.set('attemptedTransition', null);
			        } else {
			        	self.transitionToRoute('map');
			        }
				}
				self.set('flash', response.message);
			});
		}
	}	
});

module.exports = AuthLoginController;

