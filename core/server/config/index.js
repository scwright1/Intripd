/**
 * General configuration entry point
 */

var paths			= require('./paths'),
	loader			= require('./loader'),
	configuration;

function config() {
	return configuration;
}

function loadConfiguration() {
	//do the loading work here
	return loader().then(function(config) {
		configuration = config;
	});
}

config.paths = paths;
config.load = loadConfiguration;


module.exports = config;