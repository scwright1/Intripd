/**
 * 	Core application entry point
 *	Server handler
 */

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
	console.log('Server start');
	var server = require('./server');
	server();
}

server.start = start;

module.exports = server;