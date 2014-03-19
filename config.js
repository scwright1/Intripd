var config = {
	development: {
		mode:	'development',
		port:	3000,
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