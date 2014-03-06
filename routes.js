module.exports = function(server, passport) {
	try {
		require('./app/router/error')(server);
		require('./app/router/base.js')(server);
		//require('./app/router/auth.js')(server, passport);
		//require('./app/router/map-root.js')(server);
		//require('./app/router/sessions.js')(server);
		//require('./app/router/user.js')(server);
		//require('./app/router/trip.js')(server);
		//require('./app/router/waypoint.js')(server);
		//
		//once complete
		console.log(' Setup routes successfully');
	} catch(e) {
		throw new Error('routes.js: '+e);
	}
};