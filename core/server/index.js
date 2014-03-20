/**
 * Server start entry point (base config and load)
 */

var express			= require('express'),
	config			= require('./config'),
	mongodb			= require('mongodb'),
	mongoose		= require('mongoose'),
	console			= require('buggr'),
	fs				= require('fs'),
	path			= require('path'),
	async			= require('async'),
	db,
	configuration,
	dev = true;

function boot(server) {
	console.warn('Booting Server');

	//Process uncaught exceptions (crude but catches the ones that slip through)
	process.on('uncaughtException', function(err, req, res, next) {
		console.error('Unhandled Exception');
		if(dev) {
			console.assert(err);
		} else {
			var d = new Date().toISOString();
			var e_file = path.join(config.paths().logs, 'server_UE_'+d+'.log');
			fs.writeFile(e_file, err.stack, function(e) {
				if(e) {
					//if we can't write to the file in production mode we're kind of buggered for debug, but lets write out to console anyway
					console.error('✗ Failed to write assertion to file, dumping to screen.')
					console.warn('Failed to write because', e);
					console.assert(err);
				} else {
					console.emphasis('Stack flushed to persistent storage.  Shutting down');
					console.assert(err);
				}
			});
		}
	});

	//force the server to load synchronously
	async.series([
		//1 - start the server
		function(callback) {
			server.listen(configuration.port, function() {
				if(dev)console.success('✓ OK');
				console.info('Server started successfully');

				//done with this load...next
				callback();
			});
		},
		//2 - load the DB
		function(callback) {
			loadDB(/*done with this load...next*/callback);
		}
	],
	function(err, results) {
		if(err) {
			console.assert(err);
		}
	});

}


//connect to mongodb
function loadDB(callback) {
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
	db.once('open', function() {
		console.success('✓ OK');
		console.info('Mongo connection established.');
		//check that we are authenticated correctly
		//1. check that we can read
		console.warn('Checking authority of user', '"'+configuration.mongo.user+'"', 'on database');
		mongoose.connection.db.collectionNames(function(err, names) {
			if(err) {
				return console.assert(err);
			} else {
				if(dev) console.success('✓ OK Read');
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
						if(dev) console.success('✓ OK Write');
						console.info('All database checks passed.');
						callback();
					}
				});
			}
		});
	});
}


//start
function init() {
	configuration = config();
	if(configuration.mode === 'production') {
		dev = false;
	}
	var server = express();

	boot(server);
}

module.exports = init;