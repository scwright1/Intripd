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
	if(dev) debug.info('Connecting to '+uri);
	mongoose.connect(uri, options);
	db = mongoose.connection;
	db.on('error', function(e) {
		return debug.logAndExit(e);
	});
	db.once('open', function callback() {
		console.log('Mongo connection established on port '+configuration.mongo.port);
		//check that we are authenticated correctly
		//1. check that we can read
		mongoose.connection.db.collectionNames(function(err, names) {
			if(err) {
				return debug.logAndExit(err);
			} else {
				if(dev) debug.success('Mongo auth read check passed.  Moving on...');
			}
		});
		//2. check that we can write
		var cs = mongoose.Schema({name: String});
		var Check = mongoose.model('Check', cs);
		var ca = new Check({name: 'CheckAuth'});
		ca.save(function(err, chk) {
			if(err) {
				return debug.logAndExit(err);
			} else {
				Check.remove({}, function(e) {
					if(e) {
						return debug.logAndExit(e);
					} else {
						if(dev) debug.success('Mongo auth write check passed.  Moving on...');
					}
				});
			}
		}); 
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