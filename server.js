/************************************************************/
/*															*/
/*	Intripd.com												*/
/*															*/
/*	(c) 2014 Stephen Wright <ste.c.wr@gmail.com				*/
/*	All rights reserved.									*/
/*															*/
/*	filename: server.js										*/
/*	version: 2.1.8											*/
/*	export token_KEY='<[63Y4!29R8NZ<Q36@iJX3)QrSPr11'		*/
/*	export NODE_ENV='development' || 'production'			*/
/*															*/
/************************************************************/

//set up the node environment
var env = process.env.NODE_ENV || 'development';

//set us up the system variables
var express		= require('express'),

	config		= require('./config')(),

	fs			= require('fs'),

	mongodb		= require('mongodb'),

	mongoose	= require('mongoose'),

	async		= require('async'),

	passport	= require('passport'),

	user		= require('./app/models/usermodel'),

	db;

//setup debugging
require('flox-node')({});

//link express to the server
var server = express();
//
//
//
//
//
//
//1) SET UP ENVIRONMENT AND LOGGING
if(env === 'development') {
	//set up the catch-all for node error handling
	process.on('uncaughtException', function(err) {
		console.error('UNHANDLED EXCEPTION: ' + err.message);
		console.error('========== START STACK =========');
		console.error(err.stack);
		console.error('==========  END STACK  =========');
		process.exit(1);
	});

	//set up the development debug and start the server in development mode
	server.listen(config.port, function() {
		console.log('================= DEVELOPMENT MODE ====================');
		console.log('Started server in '+config.mode+' mode on port '+config.port);
	});

	//set up development server configuration
	server.use(express.static(__dirname + '/public'));
	server.use(require('morgan')('dev'));

} else if(env === 'production') {
	//set up the catch-all for node error handling - we shouldn't be seeing unhandled exceptions in production, so persist those out to file
	process.on('uncaughtException', function(err) {
		console.error('\x1B[31mFATAL ERROR!\x1B[0m Seen an Uncaught Exception in PRODUCTION mode.  Server will now recycle to compensate!');
		console.error('Error encountered: ' + err.message);
		console.error('Sending Stack Track to persistent logging');
		//send the stacktrace to error_log
		var date = new Date().toISOString();
		fs.writeFile("./logs/server_UnhandledException_"+date+'.log', err.stack, function(err) {
			if(err) {
				console.error('\x1B[31mWE COULDNT WRITE TO PERSISTENT STORAGE!\x1B[0m');
				console.error('In the hopes that we will see this, here is the stacktrace...');
				console.error(err.stack);
			} else {
				console.error('stack flushed to persistent storage.  Shutting down...');
				process.exit(1);
			}
		});
	});

	//set up the production environment
	server.listen(config.port, function(){
		console.log('Started server in '+config.mode+' mode on port '+config.port);
	});

	//set up production server configuration
	server.use(express.static(__dirname + '/public'));
	server.use(require('morgan')('tiny'));
} else {
	//we handle the situation where the NODE_ENV is set to something we're not expecting.
	console.error('\x1B[31mSTARTUP FAILURE:\x1B[0m Running in an unsupported configuration.  Please check the NODE_ENV and try again.  NODE_ENV set to "' + process.env.NODE_ENV + '"');
	process.exit(1);
}
//
//
//
//
//
//
//2) SET UP MONGOOSE FOR MONGODB COMMS
mongoose.connect('mongodb://'+config.mongo.host+'/'+config.mongo.db);
db = mongoose.connection;
db.on('error', function(e) {
	console.error('Mongo Connection Error: '+e);
});
db.once('open', function callback() {
	console.log('Mongo Connection open to '+db.host+' on port '+db.port);
	console.log('Using Database '+db.name);
});
//
//
//
//
//
//
//The rest of this needs to be done asynchronously in order to run the errorhandler last
async.series([
	//3) SET THE REMAINING SERVER CONFIGS
	function(callback) {
		//setup passport
		try{
			require('./app/controllers/passport')(passport);
		} catch(e) {
			throw new Error('Cannot setup Auth Middleware: '+e);
		}
		//set up server
		server.use(require('body-parser')());
		server.use(require('method-override')());
		server.use(require('cookie-parser')('qL17C8iQnxPuDg50mYFDk56sdR0KuUm3'));
		//initialize passport with config options defined above
		server.use(passport.initialize());
		server.use(passport.session());
		if(env === 'development') {
			console.log('Finished setting up the server config');
		}
		callback();
	},
	//4) SET UP THE ROUTES
	function(callback) {
		try {
			require('./routes')(server, passport);
			if(env === 'development') {
				console.log('Finished setting up the router config');
			}
		} catch(e) {
			throw new Error('server.js: '+e);
		}
		callback();
	},
	//5) SET UP THE ERROR HANDLING
	function(callback) {
		if(env === 'production') {
			server.use(function(err, req, res, next) {
				if(!err) return next();
				//do something more user friendly with the error messages and stacktrace
				res.send(500, {"error":"uhoh! something pretty funky happened.  Here is the message: "+err.message});
			});
		} else {
			server.use(require('errorhandler')());
		}
		if(env === 'development') {
			console.log('Finished setting up the errorhandler config');
		}
		callback();
	}
],
function(err, results) {
	if(err) {
		console.error(err);
		process.exit(1);
	}
});