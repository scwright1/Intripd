var AuthLoginController = Ember.ObjectController.extend({
	remember: true,
	actions: {
		login: function() {
			var self = this;
			data = this.getProperties('email', 'password', 'remember');
			console.log(data);
		}
	}
});

module.exports = AuthLoginController;