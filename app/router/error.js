module.exports = function(server) {
	//test function for synchronous error handling
	server.get('/error/throw', function(req, res, next) {
		throw new Error('Holy sychronous error Batman!');
	});

	//test function for asynchronous error handling
	server.get('/error/throw-async', function(req, res, next) {
		process.nextTick(function() {
			throw new Error('Holy asynchronous error Batman!');
		});
	});
};