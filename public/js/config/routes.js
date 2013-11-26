var App = require('./app');

App.Router.map(function() {
	this.resource('auth', function() {
		this.route('login');
	});

});

