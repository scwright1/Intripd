var AppSession = require('../config/session_manager');

//initialize the session at application start time
Em.Application.initializer({
	name: 'session',
	initialize: function(container, application) {
		App.Session = AppSession.create();
	}
});

var ApplicationRoute = Ember.Route.extend({
	init: function() {
		this._super();
	},
	actions: {
	    logout: function() {
	      App.Session.reset();
	      this.transitionTo('auth.login');
	    },
	    error: function(error, transition) {
	      console.log(error.message);
	    }
  }
});

Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
  if (!jqXHR.crossDomain) {
    jqXHR.setRequestHeader('X-AUTHENTICATION-TOKEN', App.Session.get('user_auth_token'));
    jqXHR.setRequestHeader('X-UID', App.Session.get('user_uid'));
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

//set up the authenticated route to allow for most pages to run on this route by default

App.AuthenticatedRoute = Ember.Route.extend({
  beforeModel: function() {
    if (!App.Session.get('user_auth_token')) {
      	this.transitionTo('auth.login');
    }
  }
});