var jwt 		= require('jwt-simple'),
	uuid 		= require('node-uuid');

module.exports = function(uid) {
	var payload = uuid.v4();
	var secret = uid;

	var token = jwt.encode(payload, secret);

	return token;
};