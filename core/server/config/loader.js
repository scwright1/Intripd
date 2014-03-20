/**
 * loader.js - manages loading for the root level config file
 * based on the way ghost.org does their parameters loading
 * seems very efficient
 * We need this so that we can correctly define the parameters for booting
 */

var fs				= require('fs'),
	path			= require('path'),
	paths			= require('./paths'),
	when			= require('when'),
	console			= require('buggr');

function read(file, env) {
	return require(file)[env];
}

function checkEnvironment() {
	//checks that the environment is sane for starting
	var env = process.env.NODE_ENV || undefined,
		config;

	if(!env) {
		return console.assert("error", 'failed to find an appropriate environment in NODE_ENV.  Please set this environment variable and try again');
	} else {
		try {
			config = read(paths().config, env);
		} catch(e) {
			//todo
			return console.assert('error', e);
		}
		if(!config) {
			return console.assert('error', 'Failed to read a valid Config');
		}

		return when.resolve(config);
	}
}

function loadConfig() {
	var loaded = when.defer(),
	pendingConfig = undefined;
	fs.open(paths().config, 'r', function(err, fd) {
		if(err) {
			return console.assert('error', err);
		} else {
			fs.close(fd);
			pendingConfig = paths().config;
		}
	});
	when(pendingConfig).then(checkEnvironment).then(loaded.resolve).otherwise(loaded.reject);
	return loaded.promise;
}

module.exports = loadConfig;