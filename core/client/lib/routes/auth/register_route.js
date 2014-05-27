var AuthRegisterRoute = Ember.Route.extend({
	beforeModel: function(transition) {
		if(App.Session.get('user_auth_token')) {
			App.Session.set('attemptedTransition', transition);
			this.transitionTo('index');
		}
	},
	model: function() {
		return Ember.Object.create({});
	}
});

module.exports = AuthRegisterRoute;