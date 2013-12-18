var AuthLoginRoute = Ember.Route.extend({
	beforeModel: function(transition) {
		if(App.Session.get('token')) {
			App.Session.set('attemptedTransition', transition);
			this.transitionTo('index');
		}
	},
	model: function() {
		return Ember.Object.create({});
	}
});

module.exports = AuthLoginRoute;

