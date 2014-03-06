module.exports = function(server) {
	server.all('/api', function(req, res) {
		res.send('Intripd API is running');
		//TODO - redirect to 401 page
	});
};