var config = {
	development: {
		mode:	'development',
		url:	'http://localhost',
		port:	3000,
		mongo: {
			host:	'127.0.0.1',
			port:	27017,
			user:	'mule',
			pw:		'~{5<+>crt1$YGr',
			db:		'IDB_dev'
		},
		facebook: {
			appId:			process.env.FACEBOOK_APPID		|| '179145525561301',
			appSecret:		process.env.FACEBOOK_APPSECRET	|| 'a9651eed53cf873cd794c6f79ea7dc64'
		}
	},
	production: {
		mode:	'production',
		url:	'http://localhost',
		port:	5000,
		mongo: {
			host:	'127.0.0.1',
			port:	27017,
			user:	'mule',
			pw:		'~{5<+>crt1$YGr',
			db: 	'IDB'
		}
	}
};

module.exports = config;