/**
 * paths for config and app in general
 */

var path			= require('path'),
	rootPath		= path.resolve(__dirname, '../../../'),
	serverPath		= path.resolve(rootPath, 'server/');

function paths() {
	return {
		'root':				rootPath,
		'server':			serverPath,
		'config':			path.join(rootPath, 'config.js'),
		'logs':				path.resolve(rootPath, 'logs/')
	}
}

module.exports = paths;