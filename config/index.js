var config = {
	development: {
		mode:	'development',
		port:	3000,
		mongo: {
			host:	'127.0.0.1',
			port:	27017,
			db:		'IDB_dev'
		}
	},
	production: {
		mode:	'production',
		port:	5000,
		mongo: {
			host:	'127.0.0.1',
			port:	27017,
			db: 	'IDB'
		}
	}
};

module.exports = function() {
	//return the correct mode based on the export, or default to development
	return config[process.env.NODE_ENV || 'development'] || config.development;
};