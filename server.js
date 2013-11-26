/* Node.js entry */

var express 	    = require('express'),
	  http          = require('http'),
    mongoose      = require('mongoose'),
    mongodb       = require('mongodb'),
    passport      = require('passport'),
    RedisStore    = require('connect-redis')(express);
    config        = require('./config')();


var server = express();

//set up model includes
var User      = require('./app/models/usermodel');

//connect to Mongo Database and check that we've connected OK.
mongoose.connect('mongodb://' + config.mongo.host + '/' + config.mongo.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  //database connection open
  console.log('Mongoose connection open at ' + db.host + ':' + db.port);
  console.log('Using database ' + db.name);
});

//set up passport configuration prior to initialize
require('./app/controllers/passport')(passport);

server.use(express.logger('dev'));
server.use(express.urlencoded());
server.use(express.json());
server.use(express.methodOverride());
server.use(express.cookieParser('qL17C8iQnxPuDg50mYFDk56sdR0KuUm3'));
//setup secret key for session hash and add to RedisStore for persistent session storage across server restarts
server.use(express.session({
  secret:'qL17C8iQnxPuDg50mYFDk56sdR0KuUm3',
  store: new RedisStore({
  })
}));
//initialize passport with config options defined above
server.use(passport.initialize());
server.use(passport.session());
server.use(server.router);
server.use(express.static(__dirname + '/public'));

server.get('/api/v1/todos', function(req, res) {
	var todo = {
		"todo": [
			{
  				id: 1,
   				title: 'Learn Ember.js',
   				isCompleted: true
 			},
 			{
   				id: 2,
   				title: '...',
   				isCompleted: false
 			},
 			{
   				id: 3,
   				title: 'Profit!',
   				isCompleted: false
 			}
		]
	};
	res.send(todo);
});

server.get('/map');

server.post('/auth/login', function(req, res) {
  console.log('got a login request');
});

server.all('/v1/users', function(req, res) {
  console.log('got an api v1 login request');
});


//start the server
http.createServer(server).listen(config.port, function() {
  console.log('Intripd starting on port ' + config.port);
});