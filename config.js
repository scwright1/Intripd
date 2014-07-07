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
		},
		apps: {
			FOURSQUARE: {
				v:		'20140706',
				id:		'TRLWJKI5WUSEHUDWHCSJPU240ZH4L0WMARTFZS2NCQSD34ML',
				sec:	'JEWXW4JPUZ0A5SVD3HDKXVKAJ5B1AUH2GMRQA321KZNDI0QR',
				calls:	5000
			}
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