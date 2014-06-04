var console = require('buggr');

module.exports = function(server, passport) {
	try {
		//TODO: routes
		require('./error')(server);
		require('./sessions')(server);
		require('./user')(server);
		require('./authentication')(server, passport);
		require('./trip')(server);
		//once complete
		console.info('Setup routes successfully');
	} catch(err) {
		console.assert('Router error:', err);
	}
};