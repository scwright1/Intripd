/**
 * loader.js - manages loading for the root level config file
 * based on the way ghost.org does their parameters loading
 * seems very efficient
 * We need this so that we can correctly define the parameters for booting
 */

var fs				= require('fs'),
	path			= require('path'),
	paths			= require('./paths'),
	when			= require('when');

function read(file, env) {
	return require(file)[env];
}

function checkEnvironment() {
	//checks that the environment is sane for starting
	var env = process.env.NODE_ENV || undefined,
		config;

	if(!env) {
		throw new Error('failed to find an appropriate environment in NODE_ENV.  Please set this environment variable and try again');
	} else {
		try {
			config = read(paths().config, env);
		} catch(e) {
			//todo
			throw new Error('Failed to load a config for some reason...');
		}
		if(!config) {
			console.error('Failed to read a valid configuration');
			throw new Error('Failed to read a valid config');
		}

		return when.resolve(config);
	}
}

function loadConfig() {
	var loaded = when.defer(),
	pendingConfig = undefined;
	fs.open(paths().config, 'r', function(err, fd) {
		if(err) {
			throw new Error('failed to find a config file');
		} else {
			fs.close(fd);
			pendingConfig = paths().config;
		}
	});
	when(pendingConfig).then(checkEnvironment).then(loaded.resolve).otherwise(loaded.reject);
	return loaded.promise;
}

module.exports = loadConfig;