/**
 * paths for config and app in general
 */

var path			= require('path'),
	rootPath		= path.resolve(__dirname, '../../../'),
	corePath		= path.resolve(rootPath, 'core/'),
	serverPath		= path.resolve(corePath, 'server/');

function paths() {
	return {
		'root':				rootPath,
		'server':			serverPath,
		'client':			path.resolve(corePath, 'client/'),
		'config':			path.join(rootPath, 'config.js'),
		'logs':				path.resolve(rootPath, 'logs/')
	}
}

module.exports = paths;