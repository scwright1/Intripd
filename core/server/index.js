/**
 * Server start entry point (base config and load)
 */

var express			= require('express'),
	config			= require('./config'),
	mongodb			= require('mongodb'),
	mongoose		= require('mongoose'),
	_				= require('underscore'),
	console			= require('buggr'),
	db,
	configuration,
	dev = true;

function boot(server) {
	console.info('Booting Server...');
	loadDB();
}

//connect to mongodb
function loadDB() {
	var options = {
		user: configuration.mongo.user,
		pass: configuration.mongo.pw
	};
	var uri = 'mongodb://'+configuration.mongo.host+'/'+configuration.mongo.db;
	if(dev) console.warn('Connecting to MongoDB:', uri, 'on port', configuration.mongo.port);
	mongoose.connect(uri, options);
	db = mongoose.connection;
	db.on('error', function(e) {
		return console.assert(e);
	});
	db.once('open', function callback() {
		console.success('✓ Mongo connection established on port '+configuration.mongo.port);
		//check that we are authenticated correctly
		//1. check that we can read
		console.warn('Checking authority of user', '"'+configuration.mongo.user+'"', 'on database');
		mongoose.connection.db.collectionNames(function(err, names) {
			if(err) {
				return console.assert(err);
			} else {
				if(dev) console.success('✓ Read check passed.');
			}
		});
		//2. check that we can write
		var cs = mongoose.Schema({name: String});
		var Check = mongoose.model('Check', cs);
		var ca = new Check({name: 'CheckAuth'});
		ca.save(function(err, chk) {
			if(err) {
				return console.assert(err);
			} else {
				Check.remove({}, function(e) {
					if(e) {
						return console.assert(e);
					} else {
						if(dev) console.success('✓ Write check passed.');
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