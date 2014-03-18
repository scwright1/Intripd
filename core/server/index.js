/**
 * Server start entry point (base config and load)
 */

var express			= require('express'),
	config			= require('./config');

function boot(server) {
	console.log('Hi');
}

function init() {
	var server = express();
	boot(server);
}

module.exports = init;