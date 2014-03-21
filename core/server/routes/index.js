var console = require('buggr');

module.exports = function(server, passport) {
	try {
		//TODO: routes
		require('./error')(server);
		//once complete
		console.info('Setup routes successfully');
	} catch(err) {
		console.assert('Router error:', err);
	}
};