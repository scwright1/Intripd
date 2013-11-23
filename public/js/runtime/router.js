/**
 * Router.js - routing table for Clientside app
 *
 * ste.c.wr@gmail.com
 *
 **/

Intripd.Router.map(function() {
	this.route('map', {path: '/map'});
});

Intripd.IndexRoute = Ember.Route.extend({
  setupController: function(controller) {
    // Set the IndexController's `title`
    controller.set('title', "Stephen");
    controller.set('random-crap', "Time to click");
  },
  renderTemplate: function(controller) {
  	this.render('container', {controller: controller});
  }
});

Intripd.MapRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('nav');
	}
});