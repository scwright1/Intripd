var App = require('./app');

App.Router.map(function() {
	this.resource('auth', function() {
		this.route('login');
	});
	
	this.resource('users', function() {
		this.route('create');
	});

	this.route('top_secret');
});

