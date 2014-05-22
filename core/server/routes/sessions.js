module.exports = function(server) {
	//destroy session data on client-side session reset
	server.post('/api/sessions/destroy', function(req, res) {
		//todo
	});
}