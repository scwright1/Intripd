/**
 * 	Core application entry point
 *	Server handler
 */

var config			= require('./server/config'),
	debug			= require('./server/debug'),
	console			= require('buggr');

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
		console.emphasis('App Starting...');
		var srv = require('./server');
		srv();
	}).otherwise(debug.logAndExit);
}

server.start = start;

module.exports = server;