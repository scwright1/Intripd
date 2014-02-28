/* Node.js entry */

var express    = require('express'),
    http       = require('http'),
    mongoose   = require('mongoose'),
    mongodb    = require('mongodb'),
    passport   = require('passport'),
    config     = require('./config')(),
    User       = require('./app/models/usermodel'),
    server     = express();

http.createServer(express);

console.logCopy = console.log.bind(console);

console.log = function()
{
    if (arguments.length)
    {
        var timestamp = '[' + Date.now() + '] ';
        this.logCopy(timestamp, arguments);
    }
};

//start the server
server.listen(config.port, function() {
  if(config.mode === "development") {
    console.log('Intripd starting on port ' + config.port);
  }
});

//export token_KEY='<[63Y4!29R8NZ<Q36@iJX3)QrSPr11'
//connect to Mongo Database and check that we've connected OK.
mongoose.connect('mongodb://' + config.mongo.host + '/' + config.mongo.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
if(config.mode === "development") {
  db.once('open', function callback() {
    console.log('Mongoose connection open at ' + db.host + ':' + db.port);
    console.log('Using database ' + db.name);
  });
}

//set up passport configuration prior to initialize
require('./app/controllers/passport')(passport);

server.use(express.logger('dev'));
server.use(express.urlencoded());
server.use(express.json());
server.use(express.methodOverride());
//use cookieparser for session storage
server.use(express.cookieParser('qL17C8iQnxPuDg50mYFDk56sdR0KuUm3'));
//initialize passport with config options defined above
server.use(passport.initialize());
server.use(passport.session());
server.use(express.static(__dirname + '/public'));

//load the routers
require('./app/router/base.js')(server);
require('./app/router/auth.js')(server, passport);
require('./app/router/map-root.js')(server);
require('./app/router/sessions.js')(server);
require('./app/router/user.js')(server);
require('./app/router/trip.js')(server);
require('./app/router/waypoint.js')(server);

//flowerbox
console.log('==============================');
console.log('=                            =');
console.log('= App Started Successfully!  =');
console.log('= Intripd "geneva" release.  =');
console.log('= (c) 2014 Intripd.          =');
console.log('= All Rights Reserved.       =');
console.log('=                            =');
console.log('==============================');