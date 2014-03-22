var ErrorRoute = Ember.Route.extend({
	redirect: function() {
		window.location.replace('404');
  	}
});

module.exports = ErrorRoute;