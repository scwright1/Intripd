/**
 * Server start entry point (base config and load)
 */

var express			= require('express'),
	config			= require('./config');

process.on('uncaughtException', function(err, req, res, next) {
	console.error('UNHANDLED EXCEPTION: ' + err.message);
	console.error('========== START STACK =========');
	console.error(err.stack);
	console.error('==========  END STACK  =========');
	process.exit(1);
});

function boot(server) {
	setTimeout(function () {
      throw new Error('User generated fault.');
   },5000);
}

function init() {
	var server = express();
	boot(server);
}

module.exports = init;