var App = require('./app');

App.Router.map(function() {
	this.resource('auth', function() {
		this.route('login');
		this.route('register');
	}); 

	this.route('map');

	this.route('tos');
	this.route('privacy');

	this.resource('marker');

	this.resource('sidebar', function() {
		this.route('user');
		this.route('trips');
	});
});

