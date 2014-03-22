var ErrorRoute = Ember.Route.extend({
	renderTemplate: function() {
    	this.render('error.404');
  	}
});

module.exports = ErrorRoute;