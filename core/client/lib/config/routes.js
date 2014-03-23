var App = require('./app');

App.Router.map(function() {

	this.resource('auth', function() {
		this.route('login');
		this.route('register');
	});

	this.route('tos');
	this.route('privacy');

	//make sure this route is always last for rendering 404 error page
	this.route("error", {path: "*path"});
});

App.Router.reopen({
	location: 'hashbang'
	//location: 'history'
});