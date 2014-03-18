/**
 * 	Core application entry point
 *	Server handler
 */

var config			= require('./server/config'),
	debug			= require('./server/debug');

//setup debugging
require('flox-node')({});

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
		console.log('Server Start');
		require('./server')();
	}).otherwise(debug.logAndExit);
}

server.start = start;

module.exports = server;