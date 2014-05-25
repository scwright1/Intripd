;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//require('../vendor/jquery.min');
//require('../vendor/jquery.cookie');
//require('../vendor/bootstrap-datepicker');
//require('../vendor/handlebars');
//require('../vendor/ember');
//require('../vendor/ember-data');

window.App = Ember.Application.create();

var App = window.App;

App.ApplicationAdapter = DS.RESTAdapter.extend({
	namespace: 'api'
});

App.Store = DS.Store.extend({
	adapter: App.ApplicationAdapter
});

module.exports = App;


/*
registerImplementation of hashbang url
 */

 (function() {

var get = Ember.get, set = Ember.set;

var hashbangLocation = Ember.HashLocation.extend({ 

    getURL: function() {
        return get(this, 'location').hash.substr(2);
    },

    setURL: function(path) {
        get(this, 'location').hash = "!"+path;
        set(this, 'lastSetURL', "!"+path);
    },

    onUpdateURL: function(callback) {
        var self = this;
        var guid = Ember.guidFor(this);

            Ember.$(window).bind('hashchange.ember-location-'+guid, function() {
                Ember.run(function() {
                    var path = location.hash.substr(2);
                    if (get(self, 'lastSetURL') === path) { return; }

                    set(self, 'lastSetURL', null);

                    callback(location.hash.substr(2));
                });
            });
        },

        formatURL: function(url) {
            return '#!'+url;
        }

    });

App.register('location:hashbang', hashbangLocation);

})();
},{}],2:[function(require,module,exports){
var App = require('./app');

App.Router.map(function() {

	this.resource('auth', function() {
		this.route('login');
		this.route('register');
	});

	this.resource('policies', function() {
		this.route('tos');
		this.route('privacy');
		this.route('cookies');
	});

	this.route('map');

	//make sure this route is always last for rendering 404 error page
	this.route("error", {path: "*path"});
});

App.Router.reopen({
	location: 'hashbang'
});
},{"./app":1}],3:[function(require,module,exports){
//Session Manager
/*
	Manages token, cookie and active trip storage, and provides hooks for global session resets
 */

var SessionManager = Ember.Object.extend({
	persist: false,
	//initialise
	init: function() {
		this._super();
		//initialise the cookies that will be used
		//TRP_USERUID
		//TRP_USERAUTHTOKEN
		//TRP_USERACTIVETRIP
		this.set('user_auth_token', $.cookie('TRP_USERAUTHTOKEN'), {expires: 365});
		this.set('user_uid', $.cookie('TRP_USERUID'), {expires: 365});
		this.set('user_active_trip', $.cookie('TRP_USERACTIVETRIP'), {expires: 365});
	},

	// Determine if the user is currently authenticated.
  	isAuthenticated: function() {
  		//return if both the user token and user uid fields are filled (even if they might be invalid)
    	return !Ember.isEmpty(this.get('user_auth_token')) && !Ember.isEmpty(this.get('user_uid'));
  	},

  	//update cookie if token changes 
  	tokenChanged: function() {
  		if(this.get('persist')) {
  			$.cookie('TRP_USERAUTHTOKEN', this.get('user_auth_token'), {expires: 365});
  		} else {
  			$.cookie('TRP_USERAUTHTOKEN', this.get('user_auth_token'));
  		}
  	}.observes('user_auth_token'),

  	//update cookie if uid changes
  	uidChanged: function() {
  		if(this.get('persist')) {
  			$.cookie('TRP_USERUID', this.get('user_uid'), {expires: 365});
  		} else {
  			$.cookie('TRP_USERUID', this.get('user_uid'));
  		}
  	}.observes('user_uid'),

  	//update cookie if trip changes
  	tripChanged: function() {
  		$.cookie('TRP_USERACTIVETRIP', this.get('user_active_trip'), {expires: 365});
  	},

  	reset: function() {
  		//dump the user back to the index page
  		Ember.run.sync();
  		//reset the session
  		Ember.run.next(this, function(){
  			var _udata = { __data: {token: this.get('user_auth_token'), uid: this.get('user_uid')} };
  			//destroy the server-side session information
  			$.post('/api/sessions/destroy', _udata).done(function() {
  				//reset the client-side tokens (cookies and internal)
  				$.deleteCookie('TRP_USERACTIVETRIP');
  				$.deleteCookie('TRP_USERUID');
  				$.deleteCookie('TRP_USERAUTHTOKEN');
  				this.set('user_active_trip', null);
  				this.set('user_auth_token', null);
  				this.set('user_uid', null);
          this.set('persist', false);
  				//reset the ajax prefilter
  				Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
  					if(!jqXHR.crossDomain) {
  						jqXHR.setRequestHeader('X-AUTHENTICATION-TOKEN', null);
						jqXHR.setRequestHeader('X-UID', null);
  					}
  				});
  				//finally, throw the user back to the index page
  				App.__container__.lookup("route:application").transitionTo('index');
  			});
  		});
  	}
});

module.exports = SessionManager;
},{}],4:[function(require,module,exports){
var ApplicationController = Ember.Controller.extend({
	actions: {
		closeCookieNotification: function() {
			$.cookie('TRP_COOKIENOTIF', false);
			$('#cookies').css('display', 'none');
		}
	}
});

module.exports = ApplicationController;
},{}],5:[function(require,module,exports){
var AuthLoginController = Ember.ObjectController.extend({
	remember: true,
	actions: {
		login: function() {
			var self = this;
			data = this.getProperties('email', 'password', 'remember');
		}
	}
});

module.exports = AuthLoginController;
},{}],6:[function(require,module,exports){
var AuthRegisterController = Em.ObjectController.extend({
	actions: {
		register: function() {
			var self = this;
			var __pwd_check = this.get('password-confirm');
			var __data = this.getProperties('firstname', 'lastname', 'email', 'password');
			if(!__data.firstname || !__data.lastname || !__data.email || !__data.password) {
				this.set('flash', 'You are missing information!');
			} else if(__data.password !== __pwd_check) {
				this.set('flash', "Your passwords do not match!");
			} else {
				this.set('flash', null);
				//todo - post data to register
				$.post('/api/auth/register', __data).done(function(resp) {
					if(resp.code !== 200) {
						//todo - error registering
					} else {
						//todo - set session tokens
						//todo - retry our attempted Transition if we have one, otherwise drop down to index
					}
				});
			}

		}
	}
});

module.exports = AuthRegisterController;
},{}],7:[function(require,module,exports){
var IndexController = Ember.ObjectController.extend({
	actions: {
		shift: function(destination) {
			$('html, body').animate({
				scrollTop: $('#'+destination).offset().top
			}, 2000);
		}
	}
});

module.exports = IndexController;
},{}],8:[function(require,module,exports){
// This file is auto-generated by `ember build`.
// You should not modify it.

var App = window.App = require('./config/app');
require('./templates');


App.ApplicationController = require('./controllers/application_controller');
App.IndexController = require('./controllers/index_controller');
App.AuthLoginController = require('./controllers/auth/login_controller');
App.AuthRegisterController = require('./controllers/auth/register_controller');
App.ApplicationRoute = require('./routes/application_route');
App.ErrorRoute = require('./routes/error_route');
App.MapRoute = require('./routes/map_route');
App.AuthLoginRoute = require('./routes/auth/login_route');
App.AuthRegisterRoute = require('./routes/auth/register_route');
App.ApplicationView = require('./views/application_view');
App.IndexView = require('./views/index_view');

require('./config/routes');

module.exports = App;


},{"./config/app":1,"./config/routes":2,"./controllers/application_controller":4,"./controllers/auth/login_controller":5,"./controllers/auth/register_controller":6,"./controllers/index_controller":7,"./routes/application_route":9,"./routes/auth/login_route":10,"./routes/auth/register_route":11,"./routes/error_route":12,"./routes/map_route":13,"./templates":14,"./views/application_view":15,"./views/index_view":16}],9:[function(require,module,exports){
var AppSession = require('../config/session_manager');

//initialize the session at application start time
Em.Application.initializer({
	name: 'session',
	initialize: function(container, application) {
		App.Session = AppSession.create();
	}
});

var ApplicationRoute = Ember.Route.extend({
	init: function() {
		this._super();
	},
	actions: {
	    logout: function() {
	      App.Session.reset();
	      this.transitionTo('index');
	    },
	    error: function(error, transition) {
	      console.log(error.message);
	    }
  }
});

Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
  if (!jqXHR.crossDomain) {
    jqXHR.setRequestHeader('X-AUTHENTICATION-TOKEN', App.Session.get('user_auth_token'));
    jqXHR.setRequestHeader('X-UID', App.Session.get('user_uid'));
  }
});

$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
  // You should include additional conditions to the if statement so that this
  // only triggers when you're absolutely certain it should
  if (jqXHR.status === 401) {
    App.Session.reset();
  }
});

module.exports = ApplicationRoute;

//set up the authenticated route to allow for most pages to run on this route by default

App.AuthenticatedRoute = Ember.Route.extend({
	redirectToLogin: function(transition) {
    App.Session.set('attemptedTransition', transition);
    this.transitionTo('auth.login');
  },

  beforeModel: function(transition) {
    if (!App.Session.get('user_auth_token')) {
      	this.redirectToLogin(transition);
    }
  }
});
},{"../config/session_manager":3}],10:[function(require,module,exports){
var AuthLoginRoute = Ember.Route.extend({
	model: function() {
		return Ember.Object.create({});
	}
});

module.exports = AuthLoginRoute;
},{}],11:[function(require,module,exports){
var AuthRegisterRoute = Ember.Route.extend({
	beforeModel: function(transition) {
		if(App.Session.get('token')) {
			App.Session.set('attemptedTransition', transition);
			this.transitionTo('index');
		}
	},
	model: function() {
		return Ember.Object.create({});
	}
});

module.exports = AuthRegisterRoute;
},{}],12:[function(require,module,exports){
var ErrorRoute = Ember.Route.extend({
	redirect: function() {
		window.location.replace('404');
  	}
});

module.exports = ErrorRoute;
},{}],13:[function(require,module,exports){
var MapRoute = App.AuthenticatedRoute.extend({
	model: function() {
		return Ember.Object.create({});
	}
});

module.exports = MapRoute;
},{}],14:[function(require,module,exports){

Ember.TEMPLATES['application'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  data.buffer.push("change your settings");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("More Information");
  }

  data.buffer.push("<div id='cookies' class='gradient'>We use cookies to deliver our services.  We assume you are happy with this, or you can ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "policies.cookies", options) : helperMissing.call(depth0, "link-to", "policies.cookies", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push(" at any time. - ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "policies.cookies", options) : helperMissing.call(depth0, "link-to", "policies.cookies", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push(" <button id='close-cookies' ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "closeCookieNotification", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">OK</button></div>\n");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  return buffer;
  
});

Ember.TEMPLATES['footer'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("Privacy");
  }

  data.buffer.push("<div id='footer'>\n	<div class='footer-panel'>\n		<div class='container'>\n			<div id='site-social' class='pull-left'>\n				<h3>Get Social with Us.</h3>\n				<a class='social-icon facebook' href='http://www.facebook.com/intripd' target='_blank'><span class='entypo-social facebook'></span></a>\n				<a class='social-icon twitter' href='http://www.twitter.com/intripd' target='_blank'><span class='entypo-social twitter'></span></a>\n				<a class='social-icon pinterest' href='http://www.pinterest.com/intripd' target='_blank'><span class='entypo-social pinterest'></span></a>\n			</div>\n			<div id='site-info' class='pull-right' style='text-align: right;'>\n				<h3>Got Questions?</h3>\n				<h5>We'd love to hear from you: <a href='mailto:contact@intripd.com'>contact@intripd.com</a></h5>\n				<script type=\"text/javascript\">\n					var today = new Date();\n					document.getElementById(\"thisyear\").innerHTML = today.getFullYear();\n    			</script>\n				<h6> &copy; 2012 - <span id='thisyear'></span>. Intripd. All rights reserved. | ");
  data.buffer.push(" | ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "policies.privacy", options) : helperMissing.call(depth0, "link-to", "policies.privacy", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</h6>\n				<sub>intripd-geneva-beta-1 | <span class='icon-html5'></span> <span class='icon-css3'></span> <span class='icon-git'></span></sub>\n			</div>\n		</div>\n	</div>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES['index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div id='splash' class='section primary-section' data-type='background' data-speed='5'>\n	");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "menu", options) : helperMissing.call(depth0, "render", "menu", options))));
  data.buffer.push("\n	<div class='grab-line'>\n		Plan, Share, Explore.\n		");
  data.buffer.push("\n	</div>\n	<div id='splash-progress' class='next-panel' ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "shift", "feature-1", {hash:{},contexts:[depth0,depth0],types:["STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("><span class='chevron'></span></div>\n</div>\n<div id='feature-1' class='section'>\n	<div class='feature-content'>\n		<div class='feature-content-text centered' style='padding-bottom: 160px;'>\n			<div class='feature-content-header'>Exploring the world is meant to be shared.</div>\n			<div class='feature-content-desc'>\n			We are building a brand new way for you to create, manage and share your travel plans and adventures. It's going to be stylish, powerful, and completely awesome.<br /><br />Interested? Let us show you what we're planning...\n			</div>\n		</div>\n		<div class='feature-content-graphics'>\n		</div>\n		<div id='splash-progress' class='next-panel' ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "shift", "feature-2", {hash:{},contexts:[depth0,depth0],types:["STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("><span class='chevron dark'></span></div>\n	</div>\n</div>\n<div id='feature-2' class='section primary-section' data-type='background' data-speed='5'>\n	<div class='feature-content'>\n		<div class='feature-content-text'>\n			<div class='feature-content-header'>\n			It's all about you.\n			</div>\n			<div class='feature-content-desc'>\n			<h4>Tools to help your world go round.</h4>\n<br />\nFrom the first city search to the last photo upload, Intripd makes managing your trips and vacations a breeze. Keep tabs on every aspect of your planning, from hotel bookings to day trips, flight times to photo opportunities, and everything in between.\n			</div>\n			<div class='feature-content-graphics'>\n			</div>\n		</div>\n	</div>\n	<div id='splash-progress' class='next-panel' ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "shift", "footer", {hash:{},contexts:[depth0,depth0],types:["STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("><span class='chevron'></span></div>\n</div>\n<!--<div id='feature-3' class='section'>\n</div>\n<div id='feature-4' class='section'>\n</div>\n<div id='feature-5' class='section primary-section' data-type='background' data-speed='5'>\n</div>-->\n");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "footer", options) : helperMissing.call(depth0, "render", "footer", options))));
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES['menu'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("<img src='/img/site-logo.png' height='48px' alt='Intripd' />");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("\n              <span class='entypo login nav-icon'></span> <span class='user-text-responsive'>Login</span>\n            ");
  }

function program5(depth0,data) {
  
  
  data.buffer.push("\n              <span class='entypo add-user nav-icon'></span> Register\n            ");
  }

  data.buffer.push("<nav class=\"navbar navbar-default navbar-static-top\" role=\"navigation\">\n	<div class=\"navbar-header\">\n    	");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("navbar-brand")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "index", options) : helperMissing.call(depth0, "link-to", "index", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  	</div>\n  	<div id=\"nav-links\">\n	    <ul class=\"nav navbar-nav navbar-right\">\n      		<li class='nav-link'>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "auth.login", options) : helperMissing.call(depth0, "link-to", "auth.login", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n          </li>\n      		<li class='nav-link'>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "auth.register", options) : helperMissing.call(depth0, "link-to", "auth.register", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n          </li>\n	    </ul>\n  	</div>\n</nav>");
  return buffer;
  
});

Ember.TEMPLATES['policies/cookies'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "menu", options) : helperMissing.call(depth0, "render", "menu", options))));
  data.buffer.push("\n		<div class=\"policy\" style='border-bottom: 1px solid #455158;'>\n			<div class=\"container\">\n				<h3>About Cookies on this site</h3>\n				<p>Cookies are small text entries, stored within the browser, used to improve the web services we offer.  They are used primarily to improve the interaction between yourselves and our website.\n				<br /><br />\n				By using cookies, we can do the following:\n				<br/><br />\n				<ul>\n					<li>Enable our services to recognise you and your device so that you can save your personal information for further sessions without having to re-enter it</li>\n					<li>Retain login information (session data), so that your login can persist across multiple sessions of use for the service.</li>\n					<li>Measure statistics about how people are using our services, so that they can be optimised and tailored to the user-load and interaction</li>\n				</ul>\n				<br /><br />\n				Without these cookies, the website and our services will assume that you are a new visitor each time you move to a new page or visit the site.\n				<br /><br />\n				European Union (EU) legislation requires that we let you know about our use of cookies.  Our cookie audit can be found below.\n				<br /><br />\n				We recommend that you allow the cookies we set, as they help us to provide a better service.  <b>We cannot identify you from these cookies, as they are anonymous.</b>\n				<br />\n				<br />\n				</p>\n				<h4>How to remove our Cookies</h4>\n				<p>If you do not want to receive cookes from our website or services, or want to remove cookies, you must select cookie settings under the Internet or Privacy settings in your browser, and then add our url <a>*.intripd.com</a> to the list of websites you do not want to accept cookies from.<br /><br />\n				These are specific instructions for how to remove cookies from each major browser:<br />\n				<a href='http://support.google.com/?hl=en&rd=1' target='_blank'>Android</a><br />\n				<a href='http://support.google.com/chrome/bin/answer.py?hl=en&answer=95647' target='_blank'>Chrome</a><br />\n				<a href='http://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences?redirectlocale=en-US&redirectslug=Enabling+and+disabling+cookies' target='_blank'>Firefox</a><br />\n				<a href='http://support.microsoft.com/kb/196955' target='_blank'>Internet Explorer</a><br />\n				<a href='http://support.apple.com/kb/PH5042' target='_blank'>Safari (Mac OSX)</a><br />\n				<a href='http://support.apple.com/kb/HT1677' target='_blank'>Safari (iOS)</a><br /><br />\n				<i><b>However, it is important to note that if you do this, you will be unable to use the vast majority of our services, as, due to the nature of the services we provide, we necessitate the need for cookies as part of the session.</b></i>\n				<br /><br /></p>\n				<h3>Cookie Audit</h3>\n				<p>Below is a list of cookies currently employed by our site and services (both 1st and 3rd party), and a detailed description of each.<br /><br /></p>\n				<h4>Persistent Cookies</h4><p>These cookies will store information for longer than your current browser session.  They are used for making it easier to enter repeated information, or remember preference settings in subsequent visits.</p>\n				<p><b>Originator: </b>intripd.com<br />\n				<b>Cookie Name: </b>TRP_COOKIENOTIF<br /><br />\n				<b>TTL: </b>1 Year.<br />\n				<b>Can be deleted? </b>Yes<br />\n				<b>Purpose: </b>A cookie used for tracking whether a user has acknowledged the Cookie Policy notification.  Once the user acknowledges the notice, the cookie is set and the notice disappears.  Setting the cookie implies consent to using cookies to track other user data.<br /><br /><br /></p>\n			</div>\n		</div>\n");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "footer", options) : helperMissing.call(depth0, "render", "footer", options))));
  return buffer;
  
});

Ember.TEMPLATES['policies/privacy'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "menu", options) : helperMissing.call(depth0, "render", "menu", options))));
  data.buffer.push("\n		<div class=\"policy\" style='border-bottom: 1px solid #455158;'>\n			<div class=\"container\">\n				<h3>Privacy Policy</h3>\n				<strong>Updated: 24th of March, 2014</strong>\n				<p>At Intripd, the privacy of our users is our top priority.  The policy below explains how we collect, use and disclose information on INTRIPD.COM in terms of how you access and use our services.  This policy applies to both our main website (www.intripd.com), as well as our social networking services, being any page or application referred to as \"Intripd\" or \"Intripd.com\".</p>\n\n				<h5>PERSONAL INFORMATION COLLECTION</h5>\n				<p>We currently collect your personal information in two ways.  We will collect the email addresses of those who communicate with us via email, information entered into the service in a voluntary way (such as name, gender, date-of-birth), or through the use of feedback forms and registration forms.  This information is used to improve the content and quality of INTRIPD.COM and our services.  We will also collect anonymous agent information, such as Internet Protocol (IP) address, Operating System, Browser information, and your GPS/Location information (if you allow this feature).\n				No information collected by us is provided or sold to other organisations for commercial purposes, except when we have your permission, or under the following circumstances:\n					<li style=\"padding-left: 10px\">When it is necessary to share information in order to investigate, prevent, or take action regarding to illegal activities, suspected fraud, situations involving potential threats to the physical safety of any person, violation of Terms of Use, or otherwise required by law; and</li>\n					<li style=\"padding-left: 10px\">In connection with, or during negotiations of, any merger, sale of company assets, financing or acquisition, or in any other situation where personal information may be disclosed or transferred as one of our business assets.</li></p>\n\n				<h5>HOW DO WE USE THE INFORMATION WE COLLECT?</h5>\n					<p><li style=\"padding-left: 10px\">For responding to emails, questions, comments, complaints, or to provide customer service;</li>\n					<li style=\"padding-left: 10px\">For sending confirmations, administrative messages, security alerts, and notifications to facilitate your use of, and our administration and operation of, our services;</li>\n					<li style=\"padding-left: 10px\">For connecting you with your friends (when instructed to by you);</li>\n					<li style=\"padding-left: 10px\">For notifying your connected friends of your actions (when instructed to by you);</li></p>\n\n				<h5>HOW DO WE PROTECT YOUR INFORMATION?</h5>\n				<p>We use industry standard techologies and procedures to help protect your personal information from unlawful or unauthorized access, accidental loss, destruction and damage and misuse.  However, please be aware that no security measures are perfect, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>\n\n				<h5>COOKIES</h5>\n				<p>We may also automatically collect certain information through the use of \"cookies”. These are small files that your browser places on your computer. We may use both session cookies and persistent cookies to better understand how you interact with our services, to monitor aggregate usage by our users and web traffic routing on our services, and to improve our services. Most Internet browsers automatically accept cookies. You can instruct your browser, by editing its options, to stop accepting cookies or to prompt you before accepting a cookie from the websites you visit. We rely on cookies for the proper operation of our website; therefore if your browser is set to reject all cookies, INTRIPD and our services will not function properly. Users who refuse cookies assume all responsibility for any resulting loss of functionality.</p>\n\n				<h5>OTHER SITES</h5>\n				<p>On occasion, our services may link to other online content.  Any information you provide on those sites is provided directly to the owner of that site, and is subject to their privacy policy.  We take no responsibility for the privacy and security practices of other services.  (We won't be linking to any sites who have privacy policies we don't agree with, however).</p>\n\n				<h5>CHILDREN</h5>\n				<p>For users accessing our services in the United States of America, INTRIPD and our related services are not directed to children under the age of 13.  We do not knowingly collect any kind of personal information from children under 13 years of age.  If you are under 13, do not use INTRIPD and our services, and do not provide any personal information to us.  If we find that children under 13 have provided us with personal information, we will take appropriate steps to remove that person's information permenantly from our databases.</p>\n\n				<h5>ACCESSING AND MODIFYING YOUR CONTENT</h5>\n				<p>If you would like to delete information held about you and/or your account, you can contact us with a request to do so.  We will take the appropriate steps to delete your data, unless such data is required to be retained persuant to applicable laws, or to protect INTRIPD and our services' rights, property or interests.  Information stored in archives will be retained for our records.</p>\n\n				<h5>QUESTIONS OR CONCERNS</h5>\n				<p>If you have any questions or concerns about our Privacy policy, please send a message to contact@intripd.com.  We will make every effort to resolve your concerns.\n\n				<h5>CHANGES TO THIS PRIVACY POLICY</h5>\n				<p>INTRIPD may modify or update this Privacy Policy from time to time, so please review it periodically.  We may provide you additional forms of notice or updeas as appropriate under the circumstances.  Your continued use of INTRIPD and our services after any modification to this Privacy Policy will constitute your acceptance of such modification.<br /><br /></p>\n			</div>\n		</div>\n");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "footer", options) : helperMissing.call(depth0, "render", "footer", options))));
  return buffer;
  
});

Ember.TEMPLATES['auth/login'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("Or Sign Up!");
  }

  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "menu", options) : helperMissing.call(depth0, "render", "menu", options))));
  data.buffer.push("\n\n<!-- Auth content -->\n<div class='login-container'>\n	<div class='auth-header'>Sign In</div>\n	<div class='auth-desc'>Got an Account? Awesome! ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "auth.register", options) : helperMissing.call(depth0, "link-to", "auth.register", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</div>\n	<form id='login-form' ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "login", {hash:{
    'on': ("submit")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n		<div class='form-group'>\n			<div class='input-group'>\n				<span class='input-group-addon'>&#xf007;</span>\n				");
  hashContexts = {'value': depth0,'class': depth0,'placeholder': depth0,'type': depth0,'autocomplete': depth0};
  hashTypes = {'value': "ID",'class': "STRING",'placeholder': "STRING",'type': "STRING",'autocomplete': "STRING"};
  options = {hash:{
    'value': ("email"),
    'class': ("form-control"),
    'placeholder': ("Email Address"),
    'type': ("email"),
    'autocomplete': ("off")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n			</div>\n		</div>\n		<div class='form-group'>\n			<div class='input-group'>\n				<span class='input-group-addon'>&#xf023;</span>\n				");
  hashContexts = {'value': depth0,'type': depth0,'class': depth0,'placeholder': depth0,'autocomplete': depth0};
  hashTypes = {'value': "ID",'type': "STRING",'class': "STRING",'placeholder': "STRING",'autocomplete': "STRING"};
  options = {hash:{
    'value': ("password"),
    'type': ("password"),
    'class': ("form-control"),
    'placeholder': ("Password"),
    'autocomplete': ("off")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n			</div>\n		</div>\n		");
  hashContexts = {'type': depth0,'id': depth0,'checked': depth0};
  hashTypes = {'type': "STRING",'id': "STRING",'checked': "ID"};
  options = {hash:{
    'type': ("checkbox"),
    'id': ("remember"),
    'checked': ("remember")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("<label id='remember-check' for='remember'>Remember Me</label>\n		<a class='forgot-password' href='#' style='display: none'>Forgotten Your Password?</a>\n		<button type='submit'>Sign In</button>\n	</form>\n</div>\n\n");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "footer", options) : helperMissing.call(depth0, "render", "footer", options))));
  return buffer;
  
});

Ember.TEMPLATES['auth/register'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("<div class='auth-desc-flash'><b>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "flash", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</b></div>");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
  data.buffer.push("<div class='auth-desc'>Get signed up and get Planning! | Already got an Account? ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "auth.login", options) : helperMissing.call(depth0, "link-to", "auth.login", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</div>");
  return buffer;
  }
function program4(depth0,data) {
  
  
  data.buffer.push("Sign In Here!");
  }

  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "menu", options) : helperMissing.call(depth0, "render", "menu", options))));
  data.buffer.push("\n\n<div class='register-container'>\n	<div class='auth-header'>Register</div>\n	");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "flash", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n	<form role='form' id='register-form' class='register-form-container' ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "register", {hash:{
    'on': ("submit")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n		<div class='register-form-container-left'>\n			<div class='form-group'>\n				<div class='input-group'>\n					<span class='input-group-addon'>&#xf007;</span>\n					");
  hashContexts = {'value': depth0,'class': depth0,'placeholder': depth0,'type': depth0,'autocomplete': depth0};
  hashTypes = {'value': "ID",'class': "STRING",'placeholder': "STRING",'type': "STRING",'autocomplete': "STRING"};
  options = {hash:{
    'value': ("firstname"),
    'class': ("form-control"),
    'placeholder': ("First Name"),
    'type': ("text"),
    'autocomplete': ("off")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n				</div>\n			</div>\n			<div class='form-group'>\n				<div class='input-group'>\n					<span class='input-group-addon'>&#xf007;</span>\n					");
  hashContexts = {'value': depth0,'type': depth0,'class': depth0,'placeholder': depth0,'autocomplete': depth0};
  hashTypes = {'value': "ID",'type': "STRING",'class': "STRING",'placeholder': "STRING",'autocomplete': "STRING"};
  options = {hash:{
    'value': ("lastname"),
    'type': ("text"),
    'class': ("form-control"),
    'placeholder': ("Last Name"),
    'autocomplete': ("off")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n				</div>\n			</div>\n			<div class='form-group'>\n				<div class='input-group'>\n					<span class='input-group-addon'>&#xf0e0;</span>\n					");
  hashContexts = {'value': depth0,'type': depth0,'class': depth0,'placeholder': depth0,'autocomplete': depth0};
  hashTypes = {'value': "ID",'type': "STRING",'class': "STRING",'placeholder': "STRING",'autocomplete': "STRING"};
  options = {hash:{
    'value': ("email"),
    'type': ("email"),
    'class': ("form-control"),
    'placeholder': ("Email Address"),
    'autocomplete': ("off")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n				</div>\n			</div>\n		</div>\n		<div class='register-form-container-right'>\n			<div class='form-group'>\n				<div class='input-group'>\n					<span class='input-group-addon'>&#xf023;</span>\n					");
  hashContexts = {'value': depth0,'class': depth0,'placeholder': depth0,'type': depth0,'autocomplete': depth0};
  hashTypes = {'value': "ID",'class': "STRING",'placeholder': "STRING",'type': "STRING",'autocomplete': "STRING"};
  options = {hash:{
    'value': ("password"),
    'class': ("form-control"),
    'placeholder': ("Password"),
    'type': ("password"),
    'autocomplete': ("off")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n				</div>\n			</div>\n			<div class='form-group'>\n				<div class='input-group'>\n					<span class='input-group-addon'>&#xf023;</span>\n					");
  hashContexts = {'value': depth0,'type': depth0,'class': depth0,'placeholder': depth0,'autocomplete': depth0};
  hashTypes = {'value': "ID",'type': "STRING",'class': "STRING",'placeholder': "STRING",'autocomplete': "STRING"};
  options = {hash:{
    'value': ("password-confirm"),
    'type': ("password"),
    'class': ("form-control"),
    'placeholder': ("Confirm Password"),
    'autocomplete': ("off")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n				</div>\n			</div>\n			<button type='submit'>Register</button>\n		</div>\n	</form>\n</div>\n\n");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "footer", options) : helperMissing.call(depth0, "render", "footer", options))));
  return buffer;
  
});



},{}],15:[function(require,module,exports){
var ApplicationView = Ember.View.extend({
	classNames: ['fill-window'],
	didInsertElement: function() {
		//reset cookie notification cookie if it doesn't exist any more
		var cookie_notification = $.cookie('TRP_COOKIENOTIF');
		if(typeof cookie_notification === "undefined") {
			$.cookie('TRP_COOKIENOTIF', true, { expires: 365 });
		}

		if(cookie_notification === "true" || (typeof cookie_notification === "undefined")) {
			$('#cookies').css('display', 'block');
		} else {
			$('#cookies').css('display', 'none');
		}
	}
});

module.exports = ApplicationView;
},{}],16:[function(require,module,exports){
var IndexView = Ember.View.extend({
	classNames: ['fill-window'],
	init: function() {
		this._super();
	},
	didInsertElement: function() {
		$('nav').addClass('animated fadeInDown');
		$('.grab-line').addClass('animated fadeInDown');
		$('#splash-progress').addClass('animated fadeInUp');
		$('#splash-progress').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
			$('#splash-progress').removeClass('animated fadeInUp').addClass('animated bounce');
		});

		$('.primary-section').each(function(){
				var $bgobj = $(this); // assigning the object
				$(window).scroll(function() {
					var yPos = -( ($(window).scrollTop() - $bgobj.offset().top) / $bgobj.data('speed'));
					// Put together our final background position
					var coords = '50% '+ yPos + 'px';
					// Move the background
					$bgobj.css({ backgroundPosition: coords });
			});
		});

		$('.next-panel').mouseenter(function() {
			var bottom = parseInt($(this).css('bottom'), 10);
			var newBottom = bottom + 10;
			$(this).animate({'bottom': newBottom + 'px'}, 500);
		}).mouseleave(function() {
			var bottom = parseInt($(this).css('bottom'), 10);
			var newBottom = bottom - 10;
			$(this).animate({'bottom': newBottom+'px'}, 500);
		});

		$(document).scroll(function () {
			var sp = $(this).scrollTop();
			if(sp >= $('#feature-2').offset().top) {
				//do feature-2 view logic
				$('#feature-2').find('.feature-content-header').css('display', 'block');
				$('#feature-2').find('.feature-content-header').addClass('animated fadeInLeft');
				setTimeout(function() {
					$('#feature-2').find('.feature-content-desc').css('display', 'block');
					$('#feature-2').find('.feature-content-desc').addClass('animated fadeInLeft');
				}, 500);
			}
		});
	}
});

module.exports = IndexView;
},{}]},{},[8])
;