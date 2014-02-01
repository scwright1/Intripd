var jwt 		= require('jwt-simple');

module.exports = function(userid, remember) {
	var payload = null;
	var expires = new Date();
	if(remember === 'true') {
		expires.setFullYear(expires.getFullYear()+1);
		payload = {
			uid: userid,
			exp: expires
		}
	} else {
		expires.setHours(expires.getHours()+4);
		payload = {
			uid: userid,
			exp: expires
		}
	}
	//pull secret from environment
	var secret = process.env.token_KEY;
	//encode the decryption token
	var token = jwt.encode(payload, secret);

	return token;
};