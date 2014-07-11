module.exports = function(server) {
	server.get('/api/waypoints', function(req, res) {
		var id = req.query.id;
		res.send(200);
	});
}