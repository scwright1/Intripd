var AppInit = require('../config/session_manager');

var ApplicationRoute = Ember.Route.extend({
	init: function() {
		this._super();
	}
});

Ember.Application.initializer({
	name: 'session',
	initialize: function(container, application) {
		AppInit.create();
	}
});

module.exports = ApplicationRoute;

