/************************************************************/
/*															*/
/*	Intripd.com												*/
/*															*/
/*	(c) 2014 Stephen Wright <ste.c.wr@gmail.com				*/
/*	All rights reserved.									*/
/*															*/
/*	filename: server.js										*/
/*	version: 2.0.1											*/
/*															*/
/************************************************************/

var express		= require('express'),
	mongodb		= require('mongodb'),
	mongoose	= require('mongoose'),
	passport	= require('passport'),
	config		= require('./config')(),
	User		= require('./app/models/usermodel');

//setup debugging
require('flox-node')({});

//link express to the server
var server = express();

//unhandledException catch for methods that fall through try/catch
process.on('unhandledException', function(err) {
	console.error('Caught unhandled Exception ' + err);
});

//start the server
try {
	server.listen(config.port, function(){console.log('Intripd starting on port ' + config.port);});
} catch(e) {
	console.error('Failed to start Server on port ' + config.port + ' due to ' + e);
}

//connect to Mongo Database and check that we've connected OK.
mongoose.connect('mongodb://' + config.mongo.host + '/' + config.mongo.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function callback() {
	console.log('Mongoose connection open at ' + db.host + ':' + db.port);
	console.log('Using database ' + db.name);
});

//set up passport configuration prior to initialize
require('./app/controllers/passport')(passport);

server.use(express.static(__dirname + '/public'));
server.use(require('morgan')('dev'));
server.use(require('body-parser')());
server.use(require('method-override')());

//initialize passport with config options defined above
server.use(passport.initialize());
server.use(passport.session());

//load the routers
setTimeout(function() {
	require('./app/router/base.js')(server);
	require('./app/router/auth.js')(server, passport);
	require('./app/router/map-root.js')(server);
	require('./app/router/sessions.js')(server);
	require('./app/router/user.js')(server);
	require('./app/router/trip.js')(server);
	require('./app/router/waypoint.js')(server);
	console.log('Routers loaded');
}, 50);