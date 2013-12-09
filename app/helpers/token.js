var jwt 		= require('jwt-simple');

module.exports = function(uid) {
	var payload = uid;
	var secret = process.env.token_KEY;
	var token = jwt.encode(payload, secret);

	return token;
};