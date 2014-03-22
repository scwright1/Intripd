var App = require('./app');

App.Router.map(function() {

	//make sure this route is always last for rendering 404 error page
	this.route("error", {path: "/*path"});
});