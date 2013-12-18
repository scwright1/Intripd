var config = {
	local: {
		mode: 	'development',
		port: 	3000,
		mongo: {
			host: 	'127.0.0.1',
			port: 	27017,
			db: 	'IDB_dev'
		}
	},
	staging: {
		mode: 	'staging',
		port: 	4000,
		mongo: {
			host: 	'127.0.0.1',
			port: 	27017,
			db: 	'IDB_dev'
		}
	},
	production: {
		mode: 	'production',
		port: 	5000,
		mongo: {
			host: 	'127.0.0.1',
			port: 	27017,
			db:  	'IDB'
		}
	}
}

module.exports = function(mode) {
	//return the correct mode based on the export, or default to local
	return config[mode || process.argv[2] || 'local'] || config.local;
}