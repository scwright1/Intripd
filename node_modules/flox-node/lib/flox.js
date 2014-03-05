/**
*  Module Dependencies
*/

//none
var d, l, f;

/**
* Expose version
*/

exports.version = '0.1.3';

/**
* Entry Point 
*/

function flox(config) {
	//init defaults
	d = 'DD/MM/YYYY';
	l = false;
	f = true;

	//if we have a config file, override the above
	if(config) {
		if(config.format) {
			d = config.format;
		}
		if(config.longfiles) {
			l = config.longfiles;
		}
		if(config.debug) {
			f = config.debug;
		}
	}

	//replace console.log
	return replaceLog();
}

Object.defineProperty(global, '__stack', {
	get: function(){
		var orig = Error.prepareStackTrace;
		Error.prepareStackTrace = function(_, stack){ return stack; };
		var err = new Error();
		Error.captureStackTrace(err, arguments.callee);
		var stack = err.stack;
		Error.prepareStackTrace = orig;
		return stack;
	}
});

Object.defineProperty(global, '__line', {
	get: function(){
		return __stack[2].getLineNumber();
	}
});

Object.defineProperty(global, '__file', {
	get: function(){
		var file =  __stack[2].getFileName();
		if(l === false) {
			var root = process.env.PWD;
			file = file.substr((file.indexOf(root) + root.length));
		}
		return file;
	}
});

function replaceLog() {
	console.flox = console.log.bind(console);
		console.log = function() {
			if (arguments.length) {

			//loop through and make a nice output of the arguments
			var args = '';
			for(var arg = 0; arg < arguments.length; arg++) {
				args = args + ' ' + arguments[arg];
			}

			var date, time;
			var da = new Date();
			time = da.getHours() + ':' + da.getMinutes() + ':' + da.getSeconds();
			if(d === 'DD/MM/YYYY') {
				date = [da.getDate(), (da.getMonth()+1), da.getFullYear()];
			} else if(d === 'MM/DD/YYYY') {
				date = [(da.getMonth()+1), da.getDate(), da.getFullYear()];
			} else if(d === 'YYYY/MM/DD') {
				date = [da.getFullYear(), (da.getMonth()+1), da.getDate()];
			} else {
				this.flox('FLOX ERROR:  Invalid date format!  Dates should be either DD/MM/YYYY, MM/DD/YYYY or YYYY/MM/DD');
				process.exit();
			}

			for(var el = 0; el < date.length; el++) {
				if(date[el] < 10) {
					date[el] = "0"+date[el];
				}
			}
			//prepend timestamp
			var timestamp;
			if(f === true) {
				timestamp = '\x1B[32m['+date[0]+'/'+date[1]+'/'+date[2]+' - '+time+']\x1B[39m | \x1B[34m'+__file+':'+__line+'\x1B[39m';
			} else {
				timestamp = '\x1B[32m['+date[0]+'/'+date[1]+'/'+date[2]+' - '+time+']\x1B[39m';
			}

			//push the new console back out
			this.flox(timestamp, args);
		}
	};
}

/**
* Expose Entry Point
*/

exports = module.exports = flox;