module.exports = function(server) {
	//destroy session data on client-side session reset
	server.post('/api/sessions/destroy', function(req, res) {
		//todo
		Session.destroy(req.body.tokenData, function(response) {
			if(response === 200) {
				res.send(response);
			} else {
				throw response;
			}
		});
	});
}