var config = {
	development: {
		mode:	'development',
		url:	'http://localhost',
		port:	6226,
		mongo: {
			host:	'127.0.0.1',
			port:	27017,
			user:	'mule',
			pw:		'~{5<+>crt1$YGr',
			db:		'IDB_dev'
		}
	},
	production: {
		mode:	'production',
		url:	'http://localhost',
		port:	7227,
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