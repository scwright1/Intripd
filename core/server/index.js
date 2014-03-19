/**
 * Server start entry point (base config and load)
 */

var express			= require('express'),
	config			= require('./config'),
	debug			= require('./debug'),
	mongodb			= require('mongodb'),
	mongoose		= require('mongoose'),
	_				= require('underscore'),
	db,
	configuration;

function boot(server) {
}

function loadDB() {
}

function init() {
	var server = express();
	boot(server);
}

module.exports = init;