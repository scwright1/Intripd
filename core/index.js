/**
 * 	Core application entry point
 *	Server handler
 */

var config			= require('./server/config');

/**
 * superfunction
 * @return {}
 */
function server() {
	return;
}

/**
 * server start entry point
 * @return {}
 */
function start() {
	config.load().then(function() { 
		console.log('Server start');
		var server = require('./server');
		server();
	});
}

server.start = start;

module.exports = server;