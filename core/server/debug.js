/**
 * errors.js
 * error handling for node.js
 * called against all functions, allows for all issues to be handled gracefully and consistently
 */

var _			= require('underscore'),
	colors		= require('colors'),
	errors;

errors = {
	//todo - error various error types
	throwError: function(err) {
		//handle no error passed
		var err;
		if(!err) {
			err = new Error('An undeclared error occurred');
		}
		//handle if err is just a string
		if(_.isString(err)) {
			throw new Error(err);
		}

		//handle everything else
		throw err;
	},
	
	logMsg: function(type, msg) {
		if(type === 'warn') {
			console.log('Warning: '.yellow, msg.yellow);
		} else if(type === "error") {
			if(!(_.isString(msg))) {
				console.log('Error:'.red, msg.message.red);
			} else {
				console.log('Error:'.red, msg.red);
			}
		} else if(type === "success") {
			console.log('Success:'.green, msg.green);
		} else {
			console.log('Info:'.cyan, msg.cyan);
		}
	},

	error: function(msg) {
		this.logMsg('error', msg);
	},

	warn: function(msg) {
		this.logMsg('warn', msg);
	},

	info: function(msg) {
		this.logMsg('info', msg);
	},

	success: function(msg) {
		this.logMsg('success', msg);
	},

	//log without throwing an exception of any kind
	logAndExit: function(msg, type) {
		if(!type) {
			this.error(msg);
		} else {
			this.logMsg(type, msg);
		}
		//exit 0 to supress unnecessary Node issues
		process.exit(0);
	},

	//log and throw an Error (hook back into Node handler)
	logAndThrow: function(msg) {
		this.error(msg);
		this.throwError(msg);
	}
};

_.bindAll(
	errors,
	'throwError',
	'logMsg',
	'error',
	'warn',
	'info',
	'success',
	'logAndExit',
	'logAndThrow'
);

module.exports = errors;