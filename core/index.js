/**
 * 	Core application entry point
 *	Server handler
 */

var config			= require('./server/config'),
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
		if(process.env.NODE_ENV === 'development') console.emphasis('App Starting...');
		var srv = require('./server');
		srv();
	});
}

server.start = start;

module.exports = server;