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
	configuration,
	dev = true;

function boot(server) {
	console.log('Booting Server...');
	loadDB();
}

//connect to mongodb
function loadDB() {
	console.log('Connecting to Database...');
	var options = {
		user: configuration.mongo.user,
		pass: configuration.mongo.pw
	};
	var uri = 'mongodb://'+configuration.mongo.host+'/'+configuration.mongo.db;
	if(dev) debug.logMsg('info', 'Connecting to '+uri);
	mongoose.connect(uri, options);
	db = mongoose.connection;
	db.on('error', function(e) {
		return debug.logAndExit('error', e);
	});
	db.once('open', function callback() {
		console.log('Mongo connection established on port '+configuration.mongo.port);
	});
}

function init() {
	configuration = config();
	if(configuration.mode === 'production') {
		dev = false;
	}
	var server = express();
	boot(server);
}

module.exports = init;