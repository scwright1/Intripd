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
	passport		= require('passport'),
	db,
	configuration,
	dev = true;

function boot(server) {
	console.log('Bringing up System...Stand By...');
	//load uncaughtExceptions fallback
	catchExceptions();
	//force the server to load synchronously
	//execute callback() once the function is complete to allow the processing to move on
	async.series([
		//1 - load the DB
		function(callback) {
			loadDB(callback);
		},


		//2 - configure express
		function(callback) {
			configServer(server, callback);
		},
		//3 - configure passport
		function(callback) {
			configAuth(server, callback);
		},


		//4 - configure routes
		function(callback) {
			loadRoutes(server, callback);
		},
		//5 - configure internal error handler
		function(callback) {
			configErrorHandler(server, callback);
		},
		//6 - start the server
		function(callback) {
			console.info('Finished configuring Server.');
			console.warn('Completing Server Boot');
			try {
				server.listen(configuration.port, function() {
					if(dev)console.success('✓ OK Boot');
					printServerInfo();
					console.info('Server started successfully');
					//done with this load...next
					callback();
				});
			} catch(e) {
				console.assert('Well...something went badly wrong.  Looks like:', e);
			}
		}
	],
	function(err, results) {
		if(err) {
			console.assert(err);
		}
	});
}




/**
 * [catchExceptions - fallback exception handling for error 500 on server]
 * @return {assert} [return assert and exit]
 */
function catchExceptions() {
	//Process uncaught exceptions (crude but catches the ones that slip through)
	process.on('uncaughtException', function(err, req, res, next) {
		console.error('Unhandled Exception');
		if(dev) {
			return console.assert(err);
		} else {
			var d = new Date().toISOString();
			var e_file = path.join(config.paths().logs, 'server_UE_'+d+'.log');
			fs.writeFile(e_file, err.stack, function(e) {
				if(e) {
					//if we can't write to the file in production mode we're kind of buggered for debug, but lets write out to console anyway
					console.error('✗ Failed to write assertion to file, dumping to screen.')
					console.warn('Failed to write because', e);
					return console.assert(err);
				} else {
					console.emphasis('Stack flushed to persistent storage.  Shutting down');
					return console.assert(err);
				}
			});
		}
	});
}





/**
 * [loadDB description]
 * @param  {Function} callback [callback to async]
 * @return {assert or callback}            [return callback if successful, or assert if failed]
 */
function loadDB(callback) {
	var options = {
		user: configuration.mongo.user,
		pass: configuration.mongo.pw
	};
	var uri = 'mongodb://'+configuration.mongo.host+'/'+configuration.mongo.db;
	console.warn('Connecting to MongoDB');
	if(dev) console.emphasis(uri, 'Port', configuration.mongo.port);
	mongoose.connect(uri, options);
	db = mongoose.connection;
	db.on('error', function(e) {
		return console.assert(e);
	});
	db.once('open', function() {
		if(dev) console.success('✓ OK Connect');
		console.info('Mongo connection established.');
		//check that we are authenticated correctly
		//1. check that we can read
		console.warn('Checking authority of user', '"'+configuration.mongo.user+'"');
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
						return callback();
					}
				});
			}
		});
	});
}





/**
 * [configServer description]
 * @param  {Function} callback [callback to async load]
 * @param {Object} server [the server object]
 * @return {callback}            [callback to async load]
 */
function configServer(server, callback) {
	try {
		console.warn('Configuring Server');
		server.use(express.static(config.paths().client));
		server.set('view engine', 'hbs');
		server.set('views', config.paths().server+'/views/errors');
		if(dev) server.use(require('morgan')('dev'));
		server.use(require('body-parser')());
		server.use(require('method-override')());
		//not convinced we need this
		server.use(require('cookie-parser')('qL17C8iQnxPuDg50mYFDk56sdR0KuUm3'));
		if(dev) console.success('✓ OK Express.use');
		return callback();
	} catch(e) {
		console.assert('Error in configServer', e);
	}
}



/**
 * Configure Passport Middleware
 * @param  {Object}   server   Contains Node.js server object
 * @param  {Function} callback Callback to async run
 */
function configAuth(server, callback) {
	try {
		require('./models/user');
		require('./middleware/passport')(passport);
		server.use(passport.initialize());
		server.use(passport.session());
		if(dev) console.success('✓ OK Passport Auth');
		return callback();
	} catch(e) {
		console.assert('Error in configuring and starting Passport Middleware', e);
	}
}



/**
 * Load router
 * @param  {Object}   server   Contains server instance
 * @param  {Function} callback Callback to async load
 * @return {Function}            Callback to async load
 */
function loadRoutes(server, callback) {
	try {
		console.warn('Starting router');
		require('./routes')(server, passport);
		server.use(function(req, res, next) {
			res.status(404);
			res.render('404', {status: 404, url: req.url});
		});
		return callback();
	} catch(e) {
		console.assert('Failed to start router:', e);
	}
}



/**
 * load ErrorHandler (internal server errors)
 * @param  {Object}   server   Contains server instance
 * @param  {Function} callback 
 */
function configErrorHandler(server, callback) {
	try {
		server.use(function(err, req, res, next) {
			if(!err) return next();
			//do something more user friendly with the error messages and stacktrace
			res.statusCode = 500;
			res.render('500', {message: err.message});
		});
		return callback();
	} catch (e) {
		console.assert(e);
	}
}



/**
 * prints out the server information for debugging
 */
function printServerInfo() {
	console.info('Server Details:');
	console.info();
	console.info('Server: ',configuration.url);
	console.info('Port:   ',configuration.port);
	console.info('DB Name:',configuration.mongo.db);
	console.info('DB Host:',configuration.mongo.host);
	console.info('DB Port:',configuration.mongo.port);
	console.info('DB User:',configuration.mongo.user);
	console.info();
}


/**
 * [init application start]
 */
function init() {
	configuration = config();
	if(configuration.mode === 'production') {
		dev = false;
	} else {
		console.log();
		console.warn('Starting in Development Mode');
		console.log();
	}
	var server = express();

	boot(server);
}

module.exports = init;