/* Node.js entry */

var express 	= require('express'),
	http 		= require('http');


var server = express();

server.use(express.logger('dev'));
server.use(express.urlencoded());
server.use(express.json());
server.use(express.methodOverride());
server.use(express.static(__dirname + '/public'));

server.get('/todos', function(req, res) {
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

//start the server
http.createServer(server).listen('3000', function() {
	console.log('Starting on port 3000');
});