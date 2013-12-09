var AppInit = require('../config/session_manager');

var ApplicationRoute = Ember.Route.extend({
	init: function() {
		this._super();
	},
  actions: {
    logout: function() {
      App.Session.reset();
      this.transitionTo('index');
    },
    error: function(error, transition) {
      console.log(error.message);
    }
  }
});

Ember.Application.initializer({
	name: 'session',
	initialize: function(container, application) {
		App.Session = AppInit.create();
	}
});

Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
  if (!jqXHR.crossDomain) {
    jqXHR.setRequestHeader('X-AUTHENTICATION-TOKEN', App.Session.get('token'));
    jqXHR.setRequestHeader('X-UID', App.Session.get('uid'));
  }
});

$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
  // You should include additional conditions to the if statement so that this
  // only triggers when you're absolutely certain it should
  if (jqXHR.status === 401) {
    App.Session.reset();
  }
});

module.exports = ApplicationRoute;

App.AuthenticatedRoute = Ember.Route.extend({
	redirectToLogin: function(transition) {
    App.Session.set('attemptedTransition', transition);
    this.transitionTo('index');
  },
 
  beforeModel: function(transition) {
    if (!App.Session.get('token')) {
      	this.redirectToLogin(transition);
    }
  }
});