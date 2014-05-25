var jwt = require('jwt-simple');

module.exports = function(id, persist) {
	var payload = null;
	var expires = new Date();

	if(persist) {
		expires.setFullYear(expires.getFullYear() + 1);
		payload = {
			uid: id,
			exp: expires
		}
	} else {
		expires.setHours(expires.getHours() + 4);
		payload = {
			uid: id,
			exp: expires
		}
	}

	return jwt.encode(payload, process.env.TOKENKEY);

};