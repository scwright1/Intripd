/**
 * Router.js - routing table for Clientside app
 *
 * ste.c.wr@gmail.com
 *
 **/

Intripd.Router.map(function() {
	this.route('map', {path: '/map'});
  this.resource('auth', {path: '/auth'}, function() {
    this.route('login');
    this.route('forgot');
    this.route('signup');
  });
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

//handle the index route for the auth resource (e.g. if the user tries to go to /auth)
Intripd.AuthIndexRoute = Ember.Route.extend({
  beforeModel: function() {
    this.transitionTo('index');
  }
});

Intripd.AuthLoginRoute = Ember.Route.extend({
  renderTemplate: function() {
    this.render('login');
  }
});

Intripd.AuthSignupRoute = Ember.Route.extend({
  renderTemplate: function() {
    this.render('login');
  }
});

Intripd.AuthForgotRoute = Ember.Route.extend({
  renderTemplate: function() {
    this.render('login');
  }
});

Intripd.MapRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('nav');
	}
});