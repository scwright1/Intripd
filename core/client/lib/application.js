;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.App = Ember.Application.create({
    LOG_TRANSITIONS: true
});

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

	this.route('register');

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
	//initialise
  persist: false,
  trip: null,
	init: function() {
		this._super();
		this.set('user_auth_token', $.cookie('TRP_USERAUTHTOKEN'));
		this.set('user_uid', $.cookie('TRP_USERUID'));
		this.set('user_active_trip', $.cookie('TRP_USERACTIVETRIP'));
	},

	// Determine if the user is currently authenticated.
  	isAuthenticated: function() {
  		//return if both the user token and user uid fields are filled (even if they might be invalid)
      return !Ember.isEmpty(this.get('user_auth_token')) && !Ember.isEmpty(this.get('user_uid'));
  	},

    hasActiveTrip: function() {
      return !Ember.isEmpty(this.get('user_active_trip'));
    },

  	//update cookie if token changes 
  	tokenChanged: function() {
  		if(this.get('persist') === true) {
  			$.cookie('TRP_USERAUTHTOKEN', this.get('user_auth_token'), {expires: 365});
  		} else {
  			$.cookie('TRP_USERAUTHTOKEN', this.get('user_auth_token'));
  		}
  	}.observes('user_auth_token'),

  	//update cookie if uid changes
  	uidChanged: function() {
  		if(this.get('persist') === true) {
  			$.cookie('TRP_USERUID', this.get('user_uid'), {expires: 365});
  		} else {
  			$.cookie('TRP_USERUID', this.get('user_uid'));
  		}
  	}.observes('user_uid'),

  	//update cookie if trip changes
  	tripChanged: function() {
  		$.cookie('TRP_USERACTIVETRIP', this.get('user_active_trip'), {expires: 365});
  	}.observes('user_active_trip'),

  	reset: function() {
  		//dump the user back to the index page
  		//reset the session
			var _udata = { __data: {token: this.get('user_auth_token'), uid: this.get('user_uid')} };
      var self = this;
			//destroy the server-side session information
			$.post('/api/authentication/logout', _udata).done(function() {
        //reset the client-side tokens (cookies and internal)
        self.set('user_active_trip', '');
        self.set('user_auth_token', '');
        self.set('user_uid', '');
        self.set('persist', false);
        $.removeCookie('TRP_USERACTIVETRIP');
        $.removeCookie('TRP_USERUID');
        $.removeCookie('TRP_USERAUTHTOKEN');
        //reset the ajax prefilter
        Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
          if(!jqXHR.crossDomain) {
            jqXHR.setRequestHeader('X-AUTHENTICATION-TOKEN', null);
          jqXHR.setRequestHeader('X-UID', null);
          }
        });
        //finally, throw the user back to the index page
        self.transitionToRoute('index');
      });
  	}
});

module.exports = SessionManager;
},{}],4:[function(require,module,exports){
var ApplicationController = Ember.ObjectController.extend({
	profile: null,
	trip: null,
	needs: ['SidebarWaypoints'],
	isAuthenticated: function() {
		return App.Session.isAuthenticated();
	}.property('App.Session.user_auth_token'),
	hasActiveTrip: function() {
		return App.Session.hasActiveTrip();
	}.property('App.Session.user_active_trip'),
	profileChanged: function() {
		var self = this;
		var uid = App.Session.get('user_uid');
		if(uid.length > 0) {
			self.store.unloadAll('profile');
			Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
			  if (!jqXHR.crossDomain) {
			    jqXHR.setRequestHeader('X-AUTHENTICATION-TOKEN', App.Session.get('user_auth_token'));
			    jqXHR.setRequestHeader('X-UID', App.Session.get('user_uid'));
			  }
			});
			var user = self.store.find('profile', App.Session.get('user_uid'));
			self.set('profile', user);
		} else {
			self.store.unloadAll('profile');
			window.location.reload();
		}
	}.observes('App.Session.user_uid'),
	tripChanged: function() {
		var self = this;
		var uid = App.Session.get('user_active_trip');
		if(uid.length > 0) {
			self.store.unloadAll('trip');
			var trip = self.store.find('trip', App.Session.get('user_active_trip'));
			self.set('trip', trip);
		} else {
			var trip = {
				name: 'No Active Trip!',
				start_date: 'No Start',
				end_date: 'No End'
			};
			self.set('trip', trip);
		}
	}.observes('App.Session.user_active_trip'),
	trip: function() {
		var trip = {
			name: 'No Active Trip!',
			start_date: 'No Start',
			end_date: 'No End'
		};
		if(App.Session.get('user_active_trip')) {
			trip = this.store.find('trip', App.Session.get('user_active_trip'));
			this.store.unloadAll('waypoint');
			var controller = this.get('controllers.SidebarWaypoints');
			var model = this.store.find('waypoint', {trip: App.Session.get('user_active_trip')});
			controller.set('model', model);
			controller.send('plot');
		}
		return trip;
	}.property(),
	profile: function() {
		var user = this.store.find('profile', App.Session.get('user_uid'));
		return user;
	}.property(),
	actions: {
		closeCookieNotification: function() {
			$.cookie('TRP_COOKIENOTIF', false, {expires: 365});
			$('#cookies').css('display', 'none');
		}
	}
});

module.exports = ApplicationController;
},{}],5:[function(require,module,exports){
var AuthLoginController = App.ApplicationController.extend({
	remember: true,
	actions: {
		login: function() {
			var self = this;
			var __data = this.getProperties('email', 'password', 'remember');
			self.set('remember', __data.remember);
			self.set('flash', null);
			if(!__data.email || !__data.password) {
				this.set('flash', 'You are missing information!');
			} else {
				$.post('/api/authentication/login', __data).done(function(response) {
					if(response.code !== 200) {
						self.set('flash', response.err);
					} else {
						App.Session.setProperties({
							user_auth_token: response.token,
							user_uid: response.uid,
							persist: self.get('remember')
						});
				        self.transitionToRoute('map');
					}
				});
			}
		}
	}
});

module.exports = AuthLoginController;
},{}],6:[function(require,module,exports){
var AuthRegisterController = App.ApplicationController.extend({
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
				$.post('/api/authentication/register', __data).done(function(resp) {
					if(resp.code !== 200) {
						//todo - error registering
						self.set('flash', resp.err);
					} else {
						App.Session.setProperties({
							user_auth_token: resp.token,
							user_uid: resp.uid
						});
						self.transitionToRoute('map');
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
			$("html, body").bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(){
				$('html, body').stop();
			});
			$('html, body').animate({
				scrollTop: $('#'+destination).offset().top
			}, 2000);
		}
	}
});

module.exports = IndexController;
},{}],8:[function(require,module,exports){
var MapController = App.ApplicationController.extend({
	map: null,
	markers: []
});

module.exports = MapController;
},{}],9:[function(require,module,exports){
var MenuController = App.ApplicationController.extend({
});

module.exports = MenuController;
},{}],10:[function(require,module,exports){
var MediaController = Ember.ObjectController.extend({
	needs: ['map'],
	name: 'sidebar/media_controller',
	debug: true
});

module.exports = MediaController;
},{}],11:[function(require,module,exports){
var ResultController = Em.ObjectController.extend({
	needs: ['map', 'SidebarWaypointDetails'],
	content: [],
	actions: {

	}
});

module.exports = ResultController;
},{}],12:[function(require,module,exports){
var SearchController = Ember.ArrayController.extend({
	needs: ['map', 'SidebarWaypointsDetails'],
	search_term_cache: null,
	search_timestamp: null,
	waypointSearch: null,
	pending_searches: 0,
	searchScope: true,
	scope: 'global',
	results: [],
	searchTextChanged: function() {
		var self = this;
		$(document).keyup(function() {
			//rate limiting on search terms being sent to the server
			//
			//1.  Nothing is really shorter than 3 characters, so first of all, make sure that
			//the search term is > 3 characters in length
			//
			if(self.get('waypointSearch').length >= 3) {
				//
				//2.  Only check if the search term has changed (i.e. don't fire on typing somewhere else)
				//
				if(self.get('waypointSearch') !== self.get('search_term_cache')) {
					//
					//3.  Immediately update the term cache, so that we don't get duplicate ajax polls waiting
					//for the first one to complete
					//
					self.set('search_term_cache', self.get('waypointSearch'));
					//
					//4.  Search
					//
					self.send('search');
				}
			}
		});
	}.observes('waypointSearch'),
	pending: function() {
		//todo, processing div over search results
		if(this.get('pending_searches') > 0) {
			$('#sidebar-menu > .search-container > .search-results > .loading-overlay').css('display', 'table');
		} else {
			$('#sidebar-menu > .search-container > .search-results > .loading-overlay').css('display', 'none');
		}
	}.observes('pending_searches'),
	updateScope: function() {
		if(this.get('searchScope') === true) {
			this.set('scope', 'global');
		} else if(this.get('searchScope') === false) {
			this.set('scope', 'browse');
		}
	}.observes('searchScope'),
	/*dynamically changes the search scope based on the current zoom level of the map*/
	contextScope: function() {
		if(this.get('controllers.map.zoom') <= 10) {
			this.set('searchScope', true);
		} else {
			this.set('searchScope', false)
		}
	}.observes('controllers.map.zoom'),
	actions: {
		search: function() {
			var now = +new Date;
			var self = this;
			var then = this.get('search_timestamp');
			if(now !== then) {
				self.set('pending_searches', (self.get('pending_searches') +1));
				var term = self.get('search_term_cache');
				if(parseInt(now - then) < 2000) {
					setTimeout(function() {
						self.send('executeSearch', now, term);
					}, 2000);
				} else {
					self.send('executeSearch', now, term);
				}
			}
		},
		executeSearch: function(now, term) {
			var self = this;
			var current = this.get('search_term_cache');
			if(current === term) {
				var center = self.get('controllers.map').get('map').getCenter();
				var ll = center.lat()+','+center.lng();
				$.ajax({
					type: 'POST',
					url: '/api/search/foursquare',
					data: {term: current, ll: ll, intent: self.get('scope')},
					dataType: 'json',
					success: function(data) {
						self.set('pending_searches', (self.get('pending_searches')-1));
						self.set('results', []);
						for(var i = 0; i < data.response.venues.length; i++) {
							var obj = (Em.Object.create(data.response.venues[i]));
							self.get('results').push(obj);
						}
					},
					complete: function() {
						self.set('search_timestamp', now);
					}
				});
			} else {
				self.set('pending_searches', (self.get('pending_searches')-1));
				return;
			}
		},
		cache: function(record) {
			this.get('store').createRecord('waypoint', {
				id: record.id,
	  			name: record.name,
	  			lat: record.location.lat,
	  			lng: record.location.lng
  			});
		}
	}
});

module.exports = SearchController;
},{}],13:[function(require,module,exports){
var CreateController = Ember.ObjectController.extend({
	needs: ['map'],
	tripname: null,
	departing: null,
	returning: null,
	flash: null,
	actions: {
		create: function() {
			//todo - validate creation fields and return flash if invalid data
			var self = this;
			self.set('flash', null);
			function convertDateToISO(dateString) {
				var rawDate = dateString.split('/');
				var date = new Date(Date.UTC(rawDate[2],rawDate[1]-1,rawDate[0],0,0));
				return date.toISOString();
			}

			//gathering trip information
			var data = this.getProperties('tripname', 'departing', 'returning');

			if(!data.tripname) {
				self.set('flash', 'Your trip name cannot be blank!');
			} else {
				if(!data.departing) {
					data.departing = "01/01/1970";
				}

				if(!data.returning) {
					data.returning = "01/01/1970";
				}

				//create record
				var trip = this.store.createRecord('trip', {
					name: data.tripname,
					start_date: convertDateToISO(data.departing),
					end_date: convertDateToISO(data.returning),
					creator_uid: App.Session.get('uid')
				});

				//persist the record
				var promise = trip.save();
				promise.then(fulfill, reject);
				function fulfill(model) {
					var marker_index = self.get('controllers.map').get('markers');
					for (var i = 0; i < marker_index.length; i++) {
						marker_index[i].setMap(null);
					}
					App.Session.set('trip', model._data);
					App.Session.set('user_active_trip', model._data.uid);
					self.set('tripname', null);
					self.set('departing', null);
					self.set('returning', null);
					$('#sidebar-menu').data('fill', false);
					$('#sidebar-menu').removeClass('active');
					$('#sidebar-menu').animate({'left': (80 - $('#sidebar-menu').width())+'px'}, {duration: 400, queue: false});
					$('#map-canvas').animate({'left': '80px'}, {duration: 400, queue: false, step: function() {
						google.maps.event.trigger(self.get('controllers.map').get('map'), 'resize');
					}});
					$('#sidebar > .menu-item').each(function() {
						if($(this).hasClass('active')) {
							$(this).removeClass('active');
						}
					});
				}

				function reject(reason) {
					alert(reason);
				}
			}
		},
		reset: function() {
			this.set('tripname', null);
			this.set('departing', null);
			this.set('returning', null);
		}
	}
});

module.exports = CreateController;
},{}],14:[function(require,module,exports){
var SidebarTripsDeleteController = App.ApplicationController.extend({
	needs: ['map'],
	tripname: null,
	confirm: false,
	flash: null,
	actions: {
		reset: function() {
			this.set('tripname', null);
		},
		checkIfActive: function() {
			if(App.Session.get('user_active_trip') === this.get('model').get('uid')) {
				this.set('flash', 'Note: This is the current active trip!');
			} else {
				this.set('flash', null);
			}
		},
		delete_trip: function() {
			var self = this;
			//get the trip object from the database
			var uid = this.get('model').get('uid');
			var trip = this.store.find('trip', uid);
			trip.then(function(model) {
				model.deleteRecord();
				if(model.get('isDeleted')) {
					model.save();
					if(App.Session.get('user_active_trip') === uid) {
						App.Session.set('user_active_trip', '');
					}
					$('#sidebar-menu').data('fill', false);
					$('#sidebar-menu').removeClass('active');
					$('#sidebar-menu').animate({'left': (80 - $('#sidebar-menu').width())+'px'}, {duration: 400, queue: false});
					$('#map-canvas').animate({'left': '80px'}, {duration: 400, queue: false, step: function() {
						google.maps.event.trigger(self.get('controllers.map').get('map'), 'resize');
					}});
					$('#sidebar > .menu-item').each(function() {
						if($(this).hasClass('active')) {
							$(this).removeClass('active');
						}
					});
				}
			}, function(reason) {
				console.log(reason);
			});
		}
	},
	tripnameChanged: function() {
		var name = this.get('model').get('name');
		if(this.get('tripname') === name) {
			this.set('confirm', true);
		} else {
			this.set('confirm', false);
		}
	}.observes('tripname'),
	confirmed: function() {
		if(this.get('confirm')) {
			$('#delete-trip-button').prop('disabled', false);
		} else {
			$('#delete-trip-button').prop('disabled', true);
		}
	}.observes('confirm')
});

module.exports = SidebarTripsDeleteController;
},{}],15:[function(require,module,exports){
var TripsController = Ember.ArrayController.extend({
	content: [],
	needs: ['map', 'SidebarWaypoints'],
	name: 'sidebar/trips_controller',
	debug: false,
	actions: {
		switch: function(trip) {
			var self = this;
			if(!trip) {
				//handle no trip error
			} else {
				//clear all previous waypoints
				self.store.unloadAll('waypoint');
				var controller = self.get('controllers.SidebarWaypoints');
				var model = self.store.find('waypoint', {trip: trip._data.uid});
				controller.set('model', model);
				controller.send('plot');
				//set the new active trip and close the menu
				App.Session.set('user_active_trip', trip._data.uid);
				$('#sidebar-menu').data('fill', false);
				$('#sidebar-menu').removeClass('active');
				$('#sidebar-menu').animate({'left': (80 - $('#sidebar-menu').width())+'px'}, {duration: 400, queue: false});
				$('#map-canvas').animate({'left': '80px'}, {duration: 400, queue: false, step: function() {
					google.maps.event.trigger(self.get('controllers.map').get('map'), 'resize');
				}});
				$('#sidebar > .menu-item').each(function() {
					if($(this).hasClass('active')) {
						$(this).removeClass('active');
					}
				});
			}
		}
	}
});

module.exports = TripsController;
},{}],16:[function(require,module,exports){
var DetailsController = Em.ObjectController.extend({
	venue: null,
	marker: null,
	needs: ['map'],
	init: function() {
		if(App.Session.get('user_active_trip')) {
			this.set('trip_exists', false);
		} else {
			this.set('trip_exists', true);
		}
	},
	actions: {
		pull: function() {
			if(App.Session.get('user_active_trip')) {
				this.set('trip_exists', false);
			} else {
				this.set('trip_exists', true);
			}
			var self = this;
			$.ajax({
				url: '/api/search/foursquare',
				dataType: 'json',
				type: 'GET',
				data: {id: self.get('id')},
				success: function(data) {
					self.set('venue', data.response.venue);
					console.log(self.get('venue'));
					$('#sidebar-menu > .search-details-container > .waypoint-result > .loading-overlay').css('display', 'none');
				}
			});
		},
		uncache: function() {
			//simple removal of waypoints from cache
			this.store.unloadAll('waypoint');
		},
		addWaypoint: function() {
			//at the moment, this can be simple
			function f(model) {
				model.set('trip', App.Session.get('user_active_trip'));
				model.save();
				var marker = self.get('marker');
				if (marker.getAnimation() != null) {
				    marker.setAnimation(null);
				  } else {
				    marker.setAnimation(google.maps.Animation.BOUNCE);
				  }
				var marker_array = self.get('controllers.map').get('markers');
			}
			function r(reason) {
				console.log(reason);
			}
			var self = this;
			var point = this.get('store').find('waypoint', self.get('id'));
			point.then(f,r);
		}
	}
});

module.exports = DetailsController;
},{}],17:[function(require,module,exports){
var EditController = Em.ObjectController.extend({
	
});

module.exports = EditController;
},{}],18:[function(require,module,exports){
var WaypointsController = Ember.ArrayController.extend({
	content: [],
	needs: ['map'],
	name: 'sidebar/waypoints_controller',
	actions: {
		plot: function() {
			var marker_index = this.get('controllers.map').get('markers');
			for (var i = 0; i < marker_index.length; i++) {
				marker_index[i].setMap(null);
			}
			var self = this;
			var data = this.get('content');
			Ember.run.later(function(){
				data.forEach(function(item){
					var ll = new google.maps.LatLng(item._data.lat, item._data.lng);
					var marker = new google.maps.Marker({
			      		position: ll,
			      		map: self.get('controllers.map').get('map'),
			      		title: item._data.name
			  		});
					marker_index.push(marker);
					google.maps.event.addListener(marker, 'click', function() {
						self.send('renderMenuElement', 'SidebarWaypointsEdit', 'sidebar-menu', item);
					});
				});
			}, 500);
		}
	}
});

module.exports = WaypointsController;
},{}],19:[function(require,module,exports){
var SidebarController = App.ApplicationController.extend({
	needs: ['map']
});

module.exports = SidebarController;
},{}],20:[function(require,module,exports){
var FriendsController = App.ApplicationController.extend({
	name: 'topbar/friends_controller',
	debug: false
});

module.exports = FriendsController;
},{}],21:[function(require,module,exports){
var TopbarController = App.ApplicationController.extend({
	needs: ['map'],
	user_image: null,
	travelling: null,
	actions: {
		get_gravatar: function() {
			var _this = this;
			function f(model) {
				var email = model._data.email;
				var elc = email.toLowerCase();
				var elct = elc.trim();
				var md5 = CryptoJS.MD5(elct).toString();
				_this.set('user_image', 'http://www.gravatar.com/avatar/'+md5+'?s=24&d=mm');
			}
			function r(reason) {
				console.log(reason);
			}
			var profile = this.store.find('profile', App.Session.get('user_uid'));
			profile.then(f,r);
		}
	}
});

module.exports = TopbarController;
},{}],22:[function(require,module,exports){
var NotificationController = Em.ObjectController.extend({
	content: [],
	needs: ['UtilsNotifications'],
	actions: {
		clear: function() {
			var list = this.get('controllers.UtilsNotifications').get('content');
			var index = list.findProperty('id', this.get('id'));
			list.removeObject(index);
		}
	}
});

module.exports = NotificationController;
},{}],23:[function(require,module,exports){
var NotificationsController = Em.ArrayController.extend({
	content: [
	Ember.Object.create({
		id: 886000000001,
		type: 'info',
		title: 'New Private Message',
		message: 'This is a message'
	}),
	Ember.Object.create({
		id: 886000000002,
		type: 'warning',
		title: 'New Information from God',
		message: 'You suck.  That is all.'
	})]
});

module.exports = NotificationsController;
},{}],24:[function(require,module,exports){
Ember.Handlebars.helper('tripdate', function(property, options) {
	var self = this;
	var ident = options.hash.date;
	//if the property isn't a promise, then just return the safe string, otherwise deal with the promise
	if(typeof property.then !== 'function') {
		var iso = property.get(ident);
		var date = generateDate(convertDate(iso));
		if(date === "1st January 1970") {
			date = "No Date Set!";
		}
		return new Ember.Handlebars.SafeString(date);
	} else {
		property.then(f,r);
		function f(model) {
			var iso = model.get(ident);
			var date = generateDate(convertDate(iso));
			if(date === "1st January 1970") {
				date = "No Date Set!";
			}
			self.set(ident, date);
		}
		function r(reason){}
	}
});

Ember.Handlebars.helper('travelDates', function(property) {
	if(App.Session.get('user_active_trip')) {
		var self = this, date;
		//if the property isn't a promise, then just return the safe string, otherwise deal with the promise
		if(typeof property.then !== 'function') {
			var start = generateDate(convertDate(property.get('start_date')));
			var end = generateDate(convertDate(property.get('end_date')));
			if((start === "1st January 1970") || (end === "1st January 1970")) {
				date = "Dates not set";
			} else {
				date = start + ' to ' + end;
			}
			return new Ember.Handlebars.SafeString(date);
		} else {
			function f(model) {
				var start = generateDate(convertDate(model.get('start_date')));
				var end = generateDate(convertDate(model.get('end_date')));
				if((start === "1st January 1970") || (end === "1st January 1970")) {
					date = "Dates not set";
				} else {
					date = start + ' to ' + end;
				}
				self.set('travelling', date);
			}
			function r(reason){}
			property.then(f,r);
		}
	} else {
		this.set('travelling', null);
	}
});

function convertDate(iso) {
	//assume ISO date in the format YYYY-MM-DDTHH:MM:SS-TT:ZZ
	var dateRegEx = /(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+).(\d+)Z/;
	var match = iso.match(dateRegEx);
	var comps = [], item, date;

	//if the iso date matches on the regex
	if(match) {
		for(var i = 1; i < match.length; i++) {
			comps.push(parseInt(match[i], 10));
		}
		return(new Date(comps[0], comps[1] - 1, comps[2]));
	}
}

function generateDate(date) {
	var y = date.getFullYear();
	var m = date.getMonth();
	var d = date.getDate();
	var dateSuffix, month;
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	dateSuffix = get_nth_suffix(d);
	month = months[m];

	return d+dateSuffix+" "+month+" "+y;
}

function get_nth_suffix(d) {
	switch(d) {
		case 1:
		case 21:
		case 31:
			return 'st';
		case 2:
		case 22:
			return 'nd';
		case 3:
		case 23:
			return 'rd';
		default:
			return 'th';
	}
}
},{}],25:[function(require,module,exports){
// This file is auto-generated by `ember build`.
// You should not modify it.

var App = window.App = require('./config/app');
require('./templates');
require('./helpers/tripHelper');


App.ApplicationController = require('./controllers/application_controller');
App.IndexController = require('./controllers/index_controller');
App.MapController = require('./controllers/map_controller');
App.MenuController = require('./controllers/menu_controller');
App.SidebarController = require('./controllers/sidebar_controller');
App.TopbarController = require('./controllers/topbar_controller');
App.UtilsNotificationController = require('./controllers/utils/notification_controller');
App.UtilsNotificationsController = require('./controllers/utils/notifications_controller');
App.TopbarFriendsController = require('./controllers/topbar/friends_controller');
App.SidebarMediaController = require('./controllers/sidebar/media_controller');
App.SidebarSearchController = require('./controllers/sidebar/search_controller');
App.SidebarTripsController = require('./controllers/sidebar/trips_controller');
App.SidebarWaypointsController = require('./controllers/sidebar/waypoints_controller');
App.SidebarWaypointsDetailsController = require('./controllers/sidebar/waypoints/details_controller');
App.SidebarWaypointsEditController = require('./controllers/sidebar/waypoints/edit_controller');
App.SidebarTripsCreateController = require('./controllers/sidebar/trips/create_controller');
App.SidebarTripsDeleteController = require('./controllers/sidebar/trips/delete_controller');
App.SidebarSearchResultController = require('./controllers/sidebar/search/result_controller');
App.AuthLoginController = require('./controllers/auth/login_controller');
App.AuthRegisterController = require('./controllers/auth/register_controller');
App.Profile = require('./models/profile');
App.Trip = require('./models/trip');
App.Waypoint = require('./models/waypoint');
App.ApplicationRoute = require('./routes/application_route');
App.ErrorRoute = require('./routes/error_route');
App.MapRoute = require('./routes/map_route');
App.TopbarFriendsRoute = require('./routes/topbar/friends_route');
App.SidebarTripsRoute = require('./routes/sidebar/trips_route');
App.AuthLoginRoute = require('./routes/auth/login_route');
App.AuthRegisterRoute = require('./routes/auth/register_route');
App.ApplicationView = require('./views/application_view');
App.FooterView = require('./views/footer_view');
App.IndexView = require('./views/index_view');
App.MapView = require('./views/map_view');
App.RegisterView = require('./views/register_view');
App.SidebarView = require('./views/sidebar_view');
App.TopbarView = require('./views/topbar_view');
App.UtilsNotificationView = require('./views/utils/notification_view');
App.TopbarFriendsView = require('./views/topbar/friends_view');
App.TopbarTriggerView = require('./views/topbar/trigger_view');
App.SidebarMediaView = require('./views/sidebar/media_view');
App.SidebarSearchView = require('./views/sidebar/search_view');
App.SidebarTriggerView = require('./views/sidebar/trigger_view');
App.SidebarTripsView = require('./views/sidebar/trips_view');
App.SidebarWaypointsView = require('./views/sidebar/waypoints_view');
App.SidebarWaypointsDetailsView = require('./views/sidebar/waypoints/details_view');
App.SidebarWaypointsEditView = require('./views/sidebar/waypoints/edit_view');
App.SidebarTripsCreateView = require('./views/sidebar/trips/create_view');
App.SidebarTripsDeleteView = require('./views/sidebar/trips/delete_view');
App.SidebarTripsEntryView = require('./views/sidebar/trips/entry_view');
App.SidebarSearchResultView = require('./views/sidebar/search/result_view');

require('./config/routes');

module.exports = App;


},{"./config/app":1,"./config/routes":2,"./controllers/application_controller":4,"./controllers/auth/login_controller":5,"./controllers/auth/register_controller":6,"./controllers/index_controller":7,"./controllers/map_controller":8,"./controllers/menu_controller":9,"./controllers/sidebar/media_controller":10,"./controllers/sidebar/search/result_controller":11,"./controllers/sidebar/search_controller":12,"./controllers/sidebar/trips/create_controller":13,"./controllers/sidebar/trips/delete_controller":14,"./controllers/sidebar/trips_controller":15,"./controllers/sidebar/waypoints/details_controller":16,"./controllers/sidebar/waypoints/edit_controller":17,"./controllers/sidebar/waypoints_controller":18,"./controllers/sidebar_controller":19,"./controllers/topbar/friends_controller":20,"./controllers/topbar_controller":21,"./controllers/utils/notification_controller":22,"./controllers/utils/notifications_controller":23,"./helpers/tripHelper":24,"./models/profile":26,"./models/trip":27,"./models/waypoint":28,"./routes/application_route":29,"./routes/auth/login_route":30,"./routes/auth/register_route":31,"./routes/error_route":32,"./routes/map_route":33,"./routes/sidebar/trips_route":34,"./routes/topbar/friends_route":35,"./templates":36,"./views/application_view":37,"./views/footer_view":38,"./views/index_view":39,"./views/map_view":40,"./views/register_view":41,"./views/sidebar/media_view":42,"./views/sidebar/search/result_view":43,"./views/sidebar/search_view":44,"./views/sidebar/trigger_view":45,"./views/sidebar/trips/create_view":46,"./views/sidebar/trips/delete_view":47,"./views/sidebar/trips/entry_view":48,"./views/sidebar/trips_view":49,"./views/sidebar/waypoints/details_view":50,"./views/sidebar/waypoints/edit_view":51,"./views/sidebar/waypoints_view":52,"./views/sidebar_view":53,"./views/topbar/friends_view":54,"./views/topbar/trigger_view":55,"./views/topbar_view":56,"./views/utils/notification_view":57}],26:[function(require,module,exports){
var Profile = DS.Model.extend({
	uid: DS.attr('string'),
	firstName: DS.attr('string'),
	lastName: DS.attr('string'),
	gender: DS.attr('string'),
	email: DS.attr('string'),
	DOB: DS.attr('date')
});

module.exports = Profile;
},{}],27:[function(require,module,exports){
var Trip = DS.Model.extend({
	uid: DS.attr('string'),
	creator_uid: DS.attr('string'),
	name: DS.attr('string'),
	creation_date: DS.attr('string'),
	start_date: DS.attr('string'),
	end_date: DS.attr('string'),
	lat: DS.attr('string'),
	lng: DS.attr('string'),
	zoom: DS.attr('number')
});

module.exports = Trip;
},{}],28:[function(require,module,exports){
var Waypoint = DS.Model.extend({
	name: DS.attr('string'),
	lat: DS.attr('string'),
	lng: DS.attr('string'),
	trip: DS.attr('string')
});

module.exports = Waypoint;
},{}],29:[function(require,module,exports){
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
  beforeModel: function() {
    if (!App.Session.get('user_auth_token')) {
      	this.transitionTo('index');
    }
  }
});
},{"../config/session_manager":3}],30:[function(require,module,exports){
var AuthLoginRoute = Ember.Route.extend({
	beforeModel: function(transition) {
		if(App.Session.get('user_auth_token')) {
			App.Session.set('attemptedTransition', transition);
			this.transitionTo('index');
		}
	},
	model: function() {
		return Ember.Object.create({});
	}
});

module.exports = AuthLoginRoute;
},{}],31:[function(require,module,exports){
var AuthRegisterRoute = Ember.Route.extend({
	beforeModel: function(transition) {
		if(App.Session.get('user_auth_token')) {
			App.Session.set('attemptedTransition', transition);
			this.transitionTo('index');
		}
	},
	model: function() {
		return Ember.Object.create({});
	}
});

module.exports = AuthRegisterRoute;
},{}],32:[function(require,module,exports){
var ErrorRoute = Ember.Route.extend({
	redirect: function() {
		window.location.replace('404');
  	}
});

module.exports = ErrorRoute;
},{}],33:[function(require,module,exports){
var MapRoute = App.AuthenticatedRoute.extend({
	actions: {
		renderMenuElement: function(element, location, model, search_key, tuid) {
			var controller = this.controllerFor(element);
			var m;
			if(typeof model == "object") {
				m = model;
			} else {
				if(search_key === 'c') {
					m = this.store.find(model, {creator_uid: App.Session.get('user_uid')});
				} else if(search_key === 't') {
					if(tuid) {
						m = this.store.find(model, tuid);
					} else {
						m = this.store.find(model, {trip: App.Session.get('user_active_trip')});
					}
				} else if(search_key === 'wl') {
					m = this.store.find(model, tuid);
				}
			}
			controller.set('model', m);
			this.render(element, {into: location, outlet: 'menu'});
		}
	},
	model: function() {
		return Ember.Object.create({});
	}
});

module.exports = MapRoute;
},{}],34:[function(require,module,exports){
var TripsRoute = App.AuthenticatedRoute.extend({
	renderTemplate: function() {
		this.render({into: 'map', outlet: 'menu'});
	}
});

module.exports = TripsRoute;
},{}],35:[function(require,module,exports){
var FriendsRoute = App.AuthenticatedRoute.extend({
	renderTemplate: function() {
		this.render({into: 'topbar', outlet: 'menu'});
	}
});

module.exports = FriendsRoute;
},{}],36:[function(require,module,exports){

Ember.TEMPLATES['application'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("change your settings");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("More Information");
  }

function program5(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n	");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "utils/notifications", options) : helperMissing.call(depth0, "render", "utils/notifications", options))));
  data.buffer.push("\n");
  return buffer;
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
  data.buffer.push(" <button style='width: 80px; font-size: 14px;' id='close-cookies' ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "closeCookieNotification", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">OK</button></div>\n");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "isAuthenticated", {hash:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  return buffer;
  
});

Ember.TEMPLATES['footer'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("Privacy");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("Cookies");
  }

  data.buffer.push("<div id='footer'>\n	<div class='footer-panel'>\n		<div class='container'>\n			<div id='site-social' class='pull-left'>\n				<h3>Get Social with Us.</h3>\n				<a class='social-icon facebook' href='http://www.facebook.com/intripd' target='_blank'><span class='fontello-facebook'></span></a>\n				<a class='social-icon twitter' href='http://www.twitter.com/intripd' target='_blank'><span class='fontello-twitter'></span></a>\n				<a class='social-icon pinterest' href='http://www.pinterest.com/intripd' target='_blank'><span class='fontello-pinterest'></span></a>\n			</div>\n			<div id='site-info' class='pull-right' style='text-align: right;'>\n				<h3>Got Questions?</h3>\n				<h5>We'd love to hear from you: <a href='mailto:contact@intripd.com'>contact@intripd.com</a></h5>\n				<h6> &copy; 2012 - <span id='thisyear'></span>. Intripd. All rights reserved.");
  data.buffer.push(" | ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "policies.privacy", options) : helperMissing.call(depth0, "link-to", "policies.privacy", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push(" | ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "policies.cookies", options) : helperMissing.call(depth0, "link-to", "policies.cookies", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</h6>\n				<sub>intripd-geneva-beta-1 | <span class='icon-html5'></span> <span class='icon-css3'></span></sub>\n			</div>\n		</div>\n	</div>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES['index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("<div class='splash-get-started'>Get Started</div>");
  }

  data.buffer.push("<div id='splash' class='section primary-section' data-type='background' data-speed='5'>\n	");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "menu", options) : helperMissing.call(depth0, "render", "menu", options))));
  data.buffer.push("\n	<div class='grab-line'>\n		Plan, Share, Explore.\n		");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "auth.register", options) : helperMissing.call(depth0, "link-to", "auth.register", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
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

Ember.TEMPLATES['map'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("\n	<section id='map'>\n		");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "sidebar", options) : helperMissing.call(depth0, "render", "sidebar", options))));
  data.buffer.push("\n		");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "topbar", options) : helperMissing.call(depth0, "render", "topbar", options))));
  data.buffer.push("\n		");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "sidebar-menu", options) : helperMissing.call(depth0, "render", "sidebar-menu", options))));
  data.buffer.push("\n		");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "topbar-menu", options) : helperMissing.call(depth0, "render", "topbar-menu", options))));
  data.buffer.push("\n		<div id='map-canvas'></div>\n	</section>");
  return buffer;
  
});

Ember.TEMPLATES['menu'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("<img src='/img/site-logo.png' height='48px' alt='Intripd' />");
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
  data.buffer.push("\n          <li class='nav-link'>\n            <span class='user-text-responsive'>Welcome back, </span><b>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "profile.firstName", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</b>\n          </li>\n          <li class='nav-link'>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "map", options) : helperMissing.call(depth0, "link-to", "map", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n          </li>\n          <li class='nav-link'>\n            <a href='#' ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "logout", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n              <span class='fontello-logout nav-icon'></span>  <span class='user-text-responsive'>Logout</span>\n            </a>\n          </li>\n        ");
  return buffer;
  }
function program4(depth0,data) {
  
  
  data.buffer.push("\n              <span class='fontello-address nav-icon'></span> <span class='user-text-responsive'><b>Map</b></span>\n            ");
  }

function program6(depth0,data) {
  
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
  data.buffer.push("\n      		<li class='nav-link'>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "auth.login", options) : helperMissing.call(depth0, "link-to", "auth.login", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n          </li>\n      		<li class='nav-link'>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "auth.register", options) : helperMissing.call(depth0, "link-to", "auth.register", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n          </li>\n        ");
  return buffer;
  }
function program7(depth0,data) {
  
  
  data.buffer.push("\n              <span class='fontello-login nav-icon'></span> <span class='user-text-responsive'>Login</span>\n            ");
  }

function program9(depth0,data) {
  
  
  data.buffer.push("\n              <span class='fontello-user-add nav-icon'></span> Register\n            ");
  }

  data.buffer.push("<nav class=\"navbar navbar-default navbar-static-top\" role=\"navigation\">\n	<div class=\"navbar-header\">\n    	");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("navbar-brand")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "index", options) : helperMissing.call(depth0, "link-to", "index", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  	</div>\n  	<div id=\"nav-links\">\n	    <ul class=\"nav navbar-nav navbar-right\">\n        ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "isAuthenticated", {hash:{},inverse:self.program(6, program6, data),fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n	    </ul>\n  	</div>\n</nav>");
  return buffer;
  
});

Ember.TEMPLATES['register'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("<section id='__auth-register_container'>\n	<div class='register-form_container'>\n	</div>\n</section>");
  
});

Ember.TEMPLATES['sidebar-menu'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<section id='sidebar-menu'>\n	");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.outlet || depth0.outlet),stack1 ? stack1.call(depth0, "menu", options) : helperMissing.call(depth0, "outlet", "menu", options))));
  data.buffer.push("\n</section>");
  return buffer;
  
});

Ember.TEMPLATES['sidebar'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\n	");
  hashContexts = {'menu_context': depth0,'icon': depth0,'width': depth0,'model_context': depth0,'search_key': depth0};
  hashTypes = {'menu_context': "STRING",'icon': "STRING",'width': "STRING",'model_context': "STRING",'search_key': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SidebarTriggerView", {hash:{
    'menu_context': ("SidebarWaypoints"),
    'icon': ("fontello-location"),
    'width': ("400"),
    'model_context': ("waypoint"),
    'search_key': ("t")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n	");
  return buffer;
  }

  data.buffer.push("\n	<div class='sidebar-logo'>\n		<img src='img/logo-white.png' width='38px' height='38px' />\n	</div>\n\n	");
  data.buffer.push("\n	");
  hashContexts = {'menu_context': depth0,'icon': depth0,'width': depth0};
  hashTypes = {'menu_context': "STRING",'icon': "STRING",'width': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SidebarTriggerView", {hash:{
    'menu_context': ("SidebarSearch"),
    'icon': ("fontello-search"),
    'width': ("400")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n	");
  hashContexts = {'menu_context': depth0,'icon': depth0,'width': depth0,'model_context': depth0,'search_key': depth0};
  hashTypes = {'menu_context': "STRING",'icon': "STRING",'width': "STRING",'model_context': "STRING",'search_key': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SidebarTriggerView", {hash:{
    'menu_context': ("SidebarTrips"),
    'icon': ("fontello-map"),
    'width': ("full"),
    'model_context': ("trip"),
    'search_key': ("c")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n	");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "hasActiveTrip", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	");
  data.buffer.push("\n	");
  data.buffer.push("\n	<div class='sidebar-accent'></div>");
  return buffer;
  
});

Ember.TEMPLATES['topbar-menu'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<section id='topbar-menu'>\n	");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.outlet || depth0.outlet),stack1 ? stack1.call(depth0, "menu", options) : helperMissing.call(depth0, "outlet", "menu", options))));
  data.buffer.push("\n</section>");
  return buffer;
  
});

Ember.TEMPLATES['topbar'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  data.buffer.push("\n	<div id='trip-quickinfo-container'>\n		<span>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "trip.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>\n		<span>");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.travelDates || depth0.travelDates),stack1 ? stack1.call(depth0, "trip", options) : helperMissing.call(depth0, "travelDates", "trip", options))));
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "travelling", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>\n	</div>\n	<div id='user-quickinfo-container'>\n		");
  hashContexts = {'menu_context': depth0,'width': depth0,'icon': depth0};
  hashTypes = {'menu_context': "STRING",'width': "STRING",'icon': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.TopbarTriggerView", {hash:{
    'menu_context': ("TopbarFriends"),
    'width': ("300"),
    'icon': ("fontello-users")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n		<div class='menu-item nohover'>\n			<img ");
  hashContexts = {'src': depth0};
  hashTypes = {'src': "STRING"};
  options = {hash:{
    'src': ("user_image")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" /> ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "profile.firstName", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "profile.lastName", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n		</div>\n		<div class='menu-item'>\n			<div class='fontello-logout' ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "logout", {hash:{
    'on': ("click")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("></div>\n		</div>\n	</div>\n");
  return buffer;
  
});

Ember.TEMPLATES['utils/notification'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class='notification gradient'>\n	<div ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': (":sider :gradient type")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push("></div>\n	<div class='information'>\n		<div class='title'>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</div>\n		<div class='content'>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "message", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</div>\n		<div class='close' ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "clear", {hash:{
    'on': ("click")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n			<div class='fontello-cancel'></div>\n		</div>\n	</div>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES['utils/notifications'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\n		");
  hashContexts = {'contentBinding': depth0};
  hashTypes = {'contentBinding': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.UtilsNotificationView", {hash:{
    'contentBinding': ("this")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n	");
  return buffer;
  }

  data.buffer.push("<div class='notifications'>\n	");
  hashContexts = {'itemController': depth0};
  hashTypes = {'itemController': "STRING"};
  stack1 = helpers.each.call(depth0, {hash:{
    'itemController': ("UtilsNotification")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>");
  return buffer;
  
});

Ember.TEMPLATES['topbar/friends'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("No Friends! :-(");
  
});

Ember.TEMPLATES['sidebar/media'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n	<p>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</p>\n	<p>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</p>\n");
  return buffer;
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "debug", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  
});

Ember.TEMPLATES['sidebar/search'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\n				");
  hashContexts = {'contentBinding': depth0};
  hashTypes = {'contentBinding': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SidebarSearchResultView", {hash:{
    'contentBinding': ("result")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n			");
  return buffer;
  }

  data.buffer.push("	<div class='search-input'>\n		");
  hashContexts = {'type': depth0,'placeholder': depth0,'value': depth0,'id': depth0};
  hashTypes = {'type': "STRING",'placeholder': "STRING",'value': "ID",'id': "STRING"};
  options = {hash:{
    'type': ("text"),
    'placeholder': ("Begin typing to search..."),
    'value': ("waypointSearch"),
    'id': ("waypoint_search_input")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n		<div class='toggle'>\n			<span class='fontello-address' style='float: left;'></span>");
  hashContexts = {'id': depth0,'class': depth0,'type': depth0,'checked': depth0};
  hashTypes = {'id': "STRING",'class': "STRING",'type': "STRING",'checked': "ID"};
  options = {hash:{
    'id': ("search_global_toggle"),
    'class': ("tgl tgl-light"),
    'type': ("checkbox"),
    'checked': ("searchScope")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n			<label class='tgl-btn' for='search_global_toggle'></label><span class='fontello-globe' style='float: right;'></span>\n		</div>\n	</div>\n	<div class='search-results'>\n		<div class='custom-point'>\n			<button class='btn btn-info'>Add custom point...</button>\n		</div>\n		<div class='venues'>\n			");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.each.call(depth0, "result", "in", "results", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n		</div>\n		<!-- pending searches overlay -->\n		<div class='loading-overlay gradient'>\n			<div class='cell'>\n				<div class='loader'>\n					<div></div>\n					<div></div>\n					<div></div>\n				</div>\n				<div class='info'><b>Getting Results...</b></div>\n			</div>\n		</div>\n	</div>");
  return buffer;
  
});

Ember.TEMPLATES['sidebar/trips'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n	<p>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</p>\n	<p>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</p>\n");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes;
  data.buffer.push("\n			");
  hashContexts = {'contentBinding': depth0};
  hashTypes = {'contentBinding': "STRING"};
  stack1 = helpers.view.call(depth0, "App.SidebarTripsEntryView", {hash:{
    'contentBinding': ("this")
  },inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		");
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n			<div ");
  hashContexts = {'id': depth0};
  hashTypes = {'id': "STRING"};
  options = {hash:{
    'id': ("uid")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" class='trip'>\n				<div class='overlay'>\n					<div class='select' ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "switch", "", {hash:{
    'on': ("click")
  },contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("><span class='fontello-check'></span></div>\n					<!--<div class='edit'><span class='fontello-cog'></span></div>-->\n					<div class='delete' data-context='delete' ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "renderMenuElement", "SidebarTripsDelete", "sidebar-menu", "trip", "t", "uid", {hash:{},contexts:[depth0,depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("><span class='fontello-cancel'></span></div>\n				</div>\n			    ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n			    ");
  hashContexts = {'date': depth0};
  hashTypes = {'date': "STRING"};
  options = {hash:{
    'date': ("start_date")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.tripdate || depth0.tripdate),stack1 ? stack1.call(depth0, "", options) : helperMissing.call(depth0, "tripdate", "", options))));
  data.buffer.push("\n			   	");
  hashContexts = {'date': depth0};
  hashTypes = {'date': "STRING"};
  options = {hash:{
    'date': ("end_date")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.tripdate || depth0.tripdate),stack1 ? stack1.call(depth0, "", options) : helperMissing.call(depth0, "tripdate", "", options))));
  data.buffer.push("\n			</div>\n		   	");
  return buffer;
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "debug", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n	<div class='stats-bar'>\n	</div>\n	<div class='all-trips'>\n		<div class='trip-box'>\n			<div id='create-trip' class='trip' ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "renderMenuElement", "SidebarTripsCreate", "sidebar-menu", {hash:{},contexts:[depth0,depth0,depth0],types:["STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n			+\n			</div>\n		</div>\n		");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	</div>");
  return buffer;
  
});

Ember.TEMPLATES['sidebar/waypoints'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n	<p ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "renderMenuElement", "SidebarWaypointsEdit", "sidebar-menu", "", {hash:{},contexts:[depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</p>\n");
  return buffer;
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  
});

Ember.TEMPLATES['sidebar/waypoints/details'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  data.buffer.push("<div class='return' ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "renderMenuElement", "SidebarSearch", "sidebar-menu", {hash:{},contexts:[depth0,depth0,depth0],types:["STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">&larr; Return to results</div>\n<div class='waypoint-result'>\n	<h5>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "venue.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h5>\n	<h6>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "venue.location.address", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h6>\n\n\n	<div class='add-to-trip'>\n		<button class='btn btn-sucess' ");
  hashContexts = {'disabled': depth0};
  hashTypes = {'disabled': "STRING"};
  options = {hash:{
    'disabled': ("trip_exists")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "addWaypoint", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Add To Trip</button>\n	</div>\n\n	<div class='loading-overlay gradient'>\n		<div class='cell'>\n			<div class='loader'>\n				<div></div>\n				<div></div>\n				<div></div>\n			</div>\n			<div class='info'><b>Fetching Details...</b></div>\n		</div>\n	</div>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES['sidebar/waypoints/edit'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class='waypoint-edit'>\n\n	<h5>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h5>\n	<h6>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "location.address", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h6>\n\n	</div>");
  return buffer;
  
});

Ember.TEMPLATES['sidebar/trips/create'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("<div class='flash'><b>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "flash", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</b></div>");
  return buffer;
  }

  data.buffer.push("\n<div id='create-trip-form'>\n	<div class='header'>Create A Trip</div>\n	");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "flash", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	<form role='form' id='trip-creation' ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "create", {hash:{
    'on': ("submit")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n		<div class='form-group'>\n			<div class='input-group'>\n				<span class='input-group-addon'>&#xf0b1;</span>\n				");
  hashContexts = {'value': depth0,'class': depth0,'placeholder': depth0,'type': depth0,'autocomplete': depth0,'name': depth0};
  hashTypes = {'value': "ID",'class': "STRING",'placeholder': "STRING",'type': "STRING",'autocomplete': "STRING",'name': "STRING"};
  options = {hash:{
    'value': ("tripname"),
    'class': ("form-control"),
    'placeholder': ("Trip Name"),
    'type': ("text"),
    'autocomplete': ("off"),
    'name': ("tripname")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n			</div>\n		</div>\n		<div class='form-group'>\n			<div class='input-group'>\n				<span class='input-group-addon'>&#xf073;</span>\n				");
  hashContexts = {'value': depth0,'class': depth0,'placeholder': depth0,'type': depth0,'autocomplete': depth0};
  hashTypes = {'value': "ID",'class': "STRING",'placeholder': "STRING",'type': "STRING",'autocomplete': "STRING"};
  options = {hash:{
    'value': ("departing"),
    'class': ("form-control date"),
    'placeholder': ("Start Date (Optional)"),
    'type': ("text"),
    'autocomplete': ("off")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n			</div>\n		</div>\n		<div class='form-group'>\n			<div class='input-group'>\n				<span class='input-group-addon'>&#xf073;</span>\n				");
  hashContexts = {'value': depth0,'type': depth0,'class': depth0,'placeholder': depth0,'autocomplete': depth0};
  hashTypes = {'value': "ID",'type': "STRING",'class': "STRING",'placeholder': "STRING",'autocomplete': "STRING"};
  options = {hash:{
    'value': ("returning"),
    'type': ("text"),
    'class': ("form-control date"),
    'placeholder': ("End Date (Optional)"),
    'autocomplete': ("off")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n			</div>\n		</div>\n		<button class='cancel' style='width: 90px; float: left;' ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "renderMenuElement", "SidebarTrips", "sidebar-menu", "trip", "c", {hash:{},contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Cancel</button>\n		<button type='submit' style='width: 240px; float: right;'>Create</button>\n	</form>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES['sidebar/trips/delete'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("<div class='flash'><p><b>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "flash", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</b></p></div>");
  return buffer;
  }

  data.buffer.push("\n<div id='delete-trip'>\n	<div class='header'>\n		Are you sure?\n	</div>\n	<div class='deletion-confirmation'>\n		<p>Warning, deleting trip <b>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</b> also deletes <b><i>all</i></b> data attached to it.  This process cannot be undone.</p>\n		<p>To proceed, type in the trip name below:</p>\n		");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "flash", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		<div class='form-group'>\n			<div class='input-group'>\n				<span class='input-group-addon'>&#xf0b1;</span>\n				");
  hashContexts = {'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0,'autocomplete': depth0};
  hashTypes = {'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING",'autocomplete': "STRING"};
  options = {hash:{
    'value': ("tripname"),
    'type': ("text"),
    'placeholder': ("Trip Name"),
    'class': ("form-control"),
    'autocomplete': ("off")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n			</div>\n		</div>\n		<button class='cancel' style='width: 90px; float: left;' ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "renderMenuElement", "SidebarTrips", "sidebar-menu", "trip", "c", {hash:{},contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Cancel</button>\n		<button class='danger' disabled='disabled' style='width: 240px; float: right;' id='delete-trip-button' ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "delete_trip", {hash:{
    'on': ("click")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Delete</button>\n	</div>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES['sidebar/search/result'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("<b>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.content.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</b>\n<h6>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.content.location.address", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" - ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.content.location.country", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h6>");
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
  data.buffer.push("\n		<div class=\"policy\" style='border-bottom: 1px solid #455158;'>\n			<div class=\"container\">\n				<h3>About Cookies on this site</h3>\n				<p>Cookies are small text entries, stored within the browser, used to improve the web services we offer.  They are used primarily to improve the interaction between yourselves and our website.\n				<br /><br />\n				By using cookies, we can do the following:\n				<br/><br />\n				<ul>\n					<li>Enable our services to recognise you and your device so that you can save your personal information for further sessions without having to re-enter it</li>\n					<li>Retain login information (session data), so that your login can persist across multiple sessions of use for the service.</li>\n					<li>Measure statistics about how people are using our services, so that they can be optimised and tailored to the user-load and interaction</li>\n				</ul>\n				<br /><br />\n				Without these cookies, the website and our services will assume that you are a new visitor each time you move to a new page or visit the site.\n				<br /><br />\n				European Union (EU) legislation requires that we let you know about our use of cookies.  Our cookie audit can be found below.\n				<br /><br />\n				We recommend that you allow the cookies we set, as they help us to provide a better service.  <b>We cannot identify you from these cookies, as they are anonymous.</b>\n				<br />\n				<br />\n				</p>\n				<h4>How to remove our Cookies</h4>\n				<p>If you do not want to receive cookes from our website or services, or want to remove cookies, you must select cookie settings under the Internet or Privacy settings in your browser, and then add our url <a>*.intripd.com</a> to the list of websites you do not want to accept cookies from.<br /><br />\n				These are specific instructions for how to remove cookies from each major browser:<br />\n				<a href='http://support.google.com/?hl=en&rd=1' target='_blank'>Android</a><br />\n				<a href='http://support.google.com/chrome/bin/answer.py?hl=en&answer=95647' target='_blank'>Chrome</a><br />\n				<a href='http://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences?redirectlocale=en-US&redirectslug=Enabling+and+disabling+cookies' target='_blank'>Firefox</a><br />\n				<a href='http://support.microsoft.com/kb/196955' target='_blank'>Internet Explorer</a><br />\n				<a href='http://support.apple.com/kb/PH5042' target='_blank'>Safari (Mac OSX)</a><br />\n				<a href='http://support.apple.com/kb/HT1677' target='_blank'>Safari (iOS)</a><br /><br />\n				<i><b>However, it is important to note that if you do this, you will be unable to use the vast majority of our services, as, due to the nature of the services we provide, we necessitate the need for cookies as part of the session.</b></i>\n				<br /><br /></p>\n				<h3>Cookie Audit</h3>\n				<p>Below is a list of cookies currently employed by our site and services (both 1st and 3rd party), and a detailed description of each.<br /><br /></p>\n				<h4>Persistent Cookies</h4><p>These cookies will store information for longer than your current browser session.  They are used for making it easier to enter repeated information, or remember preference settings in subsequent visits.</p>\n				<p><b>Originator: </b>intripd.com<br />\n				<b>Cookie Name: </b>TRP_COOKIENOTIF<br /><br />\n				<b>TTL: </b>1 Year.<br />\n				<b>Can be deleted? </b>Yes<br />\n				<b>Purpose: </b>A cookie used for tracking whether a user has acknowledged the Cookie Policy notification.  Once the user acknowledges the notice, the cookie is set and the notice disappears.  Setting the cookie implies consent to using cookies to track other user data.<br /><br /><br /></p>\n				<p><b>Originator: </b>intripd.com<br />\n				<b>Cookie Name: </b>TRP_USERAUTHTOKEN<br /><br />\n				<b>TTL: </b>Up to 1 Year.<br />\n				<b>Can be deleted? </b>Yes<br />\n				<b>Purpose: </b>A cookie used for storing a unique random user authentication token in the browser.  This cookie allows the user to return to the site without having to log in again (if \"remember me\" is selected at Login)<br /><br /><br /></p>\n				<p><b>Originator: </b>intripd.com<br />\n				<b>Cookie Name: </b>TRP_USERUID<br /><br />\n				<b>TTL: </b>Up to 1 Year.<br />\n				<b>Can be deleted? </b>Yes<br />\n				<b>Purpose: </b>A cookie used for storing a unique random user ID in the browser.  This cookie allows the user to return to the site without having to log in again (if \"remember me\" is selected at Login)<br /><br /><br /></p>\n			</div>\n		</div>\n");
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
  data.buffer.push("<div class='auth-desc'>Got an Account? Awesome! ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "auth.register", options) : helperMissing.call(depth0, "link-to", "auth.register", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</div>");
  return buffer;
  }
function program4(depth0,data) {
  
  
  data.buffer.push("Or Sign Up!");
  }

  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "menu", options) : helperMissing.call(depth0, "render", "menu", options))));
  data.buffer.push("\n\n<!-- Auth content -->\n<div class='login-container'>\n	<div class='auth-header'>Sign In</div>\n	");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "flash", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n	<form id='login-form' ");
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
  hashContexts = {'type': depth0,'id': depth0,'class': depth0,'checked': depth0};
  hashTypes = {'type': "STRING",'id': "STRING",'class': "STRING",'checked': "ID"};
  options = {hash:{
    'type': ("checkbox"),
    'id': ("remember"),
    'class': ("chk"),
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



},{}],37:[function(require,module,exports){
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
},{}],38:[function(require,module,exports){
var FooterView = Ember.View.extend({
	didInsertElement: function() {
		var today = new Date();
		document.getElementById("thisyear").innerHTML = today.getFullYear();
	}
});

module.exports = FooterView;
},{}],39:[function(require,module,exports){
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
			if(document.getElementById('splash')) {
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
			}
		});
	}
});

module.exports = IndexView;
},{}],40:[function(require,module,exports){
var MapView = Em.View.extend({
	classNames: ['fill-window'],
	didInsertElement: function() {
		this._super();
		this.loadMap();

		$(window).resize(function() {
			if($('#sidebar-menu').hasClass('active')) {
				if($('#sidebar-menu').data('fill') === true) {
					if($('#topbar-menu').hasClass('active')) {
						var right = $(document).width() - $('#topbar-menu').width();
						$('#sidebar-menu').css('width', (right-81)+'px');
						$('#map-canvas').css('left', right+'px');
					} else {
						$('#sidebar-menu').css('width', ($(document).width()-80)+'px');
						$('#map-canvas').css('left', $(document).width()+'px');
					}
				}
			}
		});
	},
	willDestroyElement: function() {
		this.set('controller.map', null);
		window.location.reload();
	},
	loadMap: function() {
		var self = this;
		window.map_callback = function() {
			self.initializeMap();
		}
		var script = document.createElement("script");
		script.type="text/javascript";
        //?key=AIzaSyCaD6yRrIC4oscatZhkSumJTxdqXMzsoxM
		script.src="https://maps.googleapis.com/maps/api/js?sensor=true&libraries=places&callback=map_callback";
		var mapGlobal = document.getElementById('map');
		mapGlobal.appendChild(script);
	},
	initializeMap: function() {
		google.maps.visualRefresh = true;
		var self = this;
		var initialZoom = 3;
		var mapOptions = {
      		center: new google.maps.LatLng(26.055889, -5.989990),
      		zoom: initialZoom,
      		mapTypeId: google.maps.MapTypeId.ROADMAP,
      		disableDefaultUI: true,
      		styles: [{"featureType": "landscape.natural","elementType": "geometry.fill","stylers": [{"color": "#f5f5f2"},{"visibility": "on"}]},{"featureType": "administrative.province","stylers": [{"visibility": "off"}]},{"featureType": "transit","stylers": [{"visibility": "off"}]},{"featureType": "poi","stylers": [{"visibility": "simplified"}]},{"featureType": "poi.attraction","stylers": [{"visibility": "off"}]},{"featureType": "landscape.man_made","elementType": "geometry.fill","stylers": [{"color": "#ffffff"},{"visibility": "on"}]},{"featureType": "poi.business","stylers": [{"visibility": "off"}]},{"featureType": "poi.medical","stylers": [{"visibility": "off"}]},{"featureType": "poi.place_of_worship","stylers": [{"visibility": "off"}]},{"featureType": "poi.school","stylers": [{"visibility": "off"}]},{"featureType": "poi.sports_complex","stylers": [{"visibility": "off"}]},{"featureType": "road.highway","elementType": "geometry","stylers": [{"color": "#ffffff"},{"visibility": "simplified"}]},{"featureType": "road.arterial","stylers": [{"visibility": "simplified"},{"color": "#ffffff"}]},{"featureType": "road.highway","elementType": "labels.icon","stylers": [{"color": "#ffffff"},{"visibility": "off"}]},{"featureType": "road.highway","elementType": "labels.icon","stylers": [{"visibility": "off"}]},{"featureType": "road.arterial","stylers": [{"color": "#ffffff"}]},{"featureType": "road.local","stylers": [{"color": "#ffffff"}]},{"featureType": "poi.park","elementType": "labels.icon","stylers": [{"visibility": "off"}]},{"featureType": "water","stylers": [{"color": "#71c8d4"}]},{"featureType": "landscape","stylers": [{"color": "#e5e8e7"}]},{"featureType": "poi.park","stylers": [{"color": "#8ba129"}]},{"featureType": "road","stylers": [{"color": "#ffffff"}]},{"featureType": "poi.sports_complex","elementType": "geometry","stylers": [{"color": "#c7c7c7"},{"visibility": "off"}]},{"featureType": "water","stylers": [{"color": "#a0d3d3"}]},{"featureType": "poi.park","stylers": [{"color": "#91b65d"}]},{"featureType": "poi.park","stylers": [{"gamma": 1.51}]},{"featureType": "road.local","stylers": [{"visibility": "off"}]},{"featureType": "road.local","elementType": "geometry","stylers": [{"visibility": "on"}]},{"featureType": "poi.government","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "landscape","stylers": [{"visibility": "off"}]},{"featureType": "road","elementType": "labels","stylers": [{"visibility": "off"}]},{"featureType": "road.arterial","elementType": "geometry","stylers": [{"visibility": "simplified"}]},{"featureType": "road.local","stylers": [{"visibility": "simplified"}]},{"featureType": "road"},{"featureType": "road"},{},{"featureType": "road.highway"}]
    	};
    	this.set('controller.zoom', initialZoom);
    	this.set('controller.map', new google.maps.Map(document.getElementById("map-canvas"),mapOptions));
    	google.maps.event.trigger(this.get('controller.map'), 'resize');
    	google.maps.event.addListener(this.get('controller.map'), 'zoom_changed', function() {
		  self.set('controller.zoom', self.get('controller.map').getZoom());
		});
	}
});

module.exports = MapView;
},{}],41:[function(require,module,exports){
var RegisterView = Em.View.extend({
	templateName: 'register',
	classNames: ['content-container']
});

module.exports = RegisterView;
},{}],42:[function(require,module,exports){
var MediaView = Em.View.extend({
	name: 'sidebar/media_view',
	templateName: 'sidebar/media',
	classNames: ['media-container']
});

module.exports = MediaView;
},{}],43:[function(require,module,exports){
/**
 * SidebarSearchResultView
 */

var ResultView = Em.View.extend({
	templateName: 'sidebar/search/result',
	classNames: ['result'],
	click: function() {
		var self = this;
		var map = this.get('controller.controllers.map').get('map');
		var latlng = new google.maps.LatLng(self.get('content.location.lat'), self.get('content.location.lng'));
		map.setZoom(12);
		map.panTo(latlng);
		var marker = new google.maps.Marker({
      		position: latlng,
      		map: map,
      		title: this.get('content.name')
  		});

  		//now we create a temporary model in the store so that we can potentially save it out to the database should we want to:
  		this.get('controller').send('cache', self.get('content'));
  		this.get('controller.controllers.SidebarWaypointsDetails').set('marker', marker);
  		this.get('controller').send('renderMenuElement', 'SidebarWaypointsDetails', 'sidebar-menu', 'waypoint', 'wl', self.get('content.id'));
	}
});

module.exports = ResultView;
},{}],44:[function(require,module,exports){
var SearchView = Em.View.extend({
	name: 'sidebar/search_view',
	templateName: 'sidebar/search',
	classNames: ['search-container'],
	didInsertElement: function() {
		var left = 0 - this.$().parent().width();
        this.$().css('left', left + 'px');
      	this.$().animate({'left': '0px'}, {duration: 200,queue: false});
	},
	willDestroyElement: function() {
		var _this = this;
		var clone = this.$().clone();
        this.$().parent().append(clone);
        var left = this.$().width();
        clone.animate({'left': (0-left) + 'px'}, {duration: 200, queue: false, complete: function() {
        	_this.destroy();
        	clone.remove();
        }});
	}
});

module.exports = SearchView;
},{}],45:[function(require,module,exports){
/**
 * Sidebar/trigger_view.js
 * View logic for the sidebar menu items to allow for insertion of the primary menus
 * Created: 19/Jun/2014
 */

var TriggerView = Em.View.extend({
	classNames: ['menu-item'],
	template: Ember.Handlebars.compile("<div {{bind-attr class='view.icon'}}></div>"),
	click: function() {

		var $m = $('#sidebar-menu'),
			$c = $('#map-canvas'),
			$t = $('#topbar-menu'),
			_t = this;

		if($m.hasClass('active')) {
			if(this.$().hasClass('active')) {
				//this is the current active menu, so close
				this.$().removeClass('active');
				$m.data('fill', false);
				$m.removeClass('active');
				$m.animate({'left': (80 - $m.width())+'px'}, {duration: 400, queue: false});
				$c.animate({'left': '80px'}, {duration: 400, queue: false, step: function() {
					google.maps.event.trigger(_t.get('controller.controllers.map').get('map'), 'resize');
				}});
			} else {
				//change the currently active menu
				for(var i = 0; i < _t.get('parentView').get('childViews').length; i++) {
					_t.get('parentView').get('childViews').objectAt(i).$().removeClass('active');
				}
				this.$().addClass('active');
				this.get('controller').send('renderMenuElement', this.get('menu_context'), 'sidebar-menu', this.get('model_context'), this.get('search_key'));
				if(this.get('width') === 'full') {
					$m.data('fill', true);
					//transition to full screen width
					if($t.hasClass('active')) {
						//fill up to social sidebar
						var w = ($(document).width() - ($t.width() + 81));
						var l = ($(document).width() - $t.width());
						$m.animate({'width': w+'px'}, {duration: 400, queue: false});
						$c.animate({'left': l+'px'}, {duration: 400, queue: false, step: function() {
							google.maps.event.trigger(_t.get('controller.controllers.map').get('map'), 'resize');
						}});
					} else {
						//social sidebar not open, so fill width
						var w = ($(document).width() - 80);
						$m.animate({'width': w+'px'}, {duration: 400, queue: false});
						$c.animate({'left': $(document).width()+'px'}, {duration: 400, queue: false, step: function() {
							google.maps.event.trigger(_t.get('controller.controllers.map').get('map'), 'resize');
						}});
					}
				} else {
					$m.data('fill', false);
					var l = parseInt(this.get('width')) + 80;
					$m.animate({'width': _t.get('width')+'px'}, {duration: 400, queue: false});
					$c.animate({'left': l+'px'}, {duration: 400, queue: false, step: function() {
						google.maps.event.trigger(_t.get('controller.controllers.map').get('map'), 'resize');
					}});
				}

			}
		} else {
			var w;
			this.$().addClass('active');
			//open the menu
			this.get('controller').send('renderMenuElement', this.get('menu_context'), 'sidebar-menu', this.get('model_context'), this.get('search_key'));
			$m.addClass('active');
			if(this.get('width') === 'full') {
				$m.data('fill', true);
				if($t.hasClass('active')) {
					w = $(document).width() - ($t.width() + 81);
				} else {
					w = $(document).width() - 80;
				}
			} else {
				w = this.get('width');
			}
			$m.css('left', (80-w)+'px');
			$m.css('width', w+'px');
			$m.animate({'left': '80px'}, {duration: 400, queue: false});
			var ml = parseInt(w) + 80;
			$c.animate({'left': ml+'px'}, {duration: 400, queue: false, step: function() {
				google.maps.event.trigger(_t.get('controller.controllers.map').get('map'), 'resize');
			}});
		}
	}
});

module.exports = TriggerView;
},{}],46:[function(require,module,exports){
var CreateView = Ember.View.extend({
	templateName: 'sidebar/trips/create',
	classNames: ['create-container'],
	didInsertElement: function() {
		//reset name attributes
		this.get('controller').send('reset');
		var right = this.$().parent().width();
        this.$().css('left', right + 'px');
        this.$().animate({'left': '0px'}, {duration: 400,queue: false});
        $('#create-trip-form > #trip-creation > .form-group > .input-group > .date').datepicker({
			format: "dd/mm/yyyy",
			autoclose: true
		});
	},
	willDestroyElement: function() {
		var _this = this;
		var clone = this.$().clone();
        this.$().parent().append(clone);
        var left = this.$().width();
        clone.animate({'left': left + 'px'}, {duration: 200, queue: false, complete: function() {
        	_this.destroy();
        	clone.remove();
        }});
	}
});

module.exports = CreateView;
},{}],47:[function(require,module,exports){
var DeleteView = Em.View.extend({
	templateName: 'sidebar/trips/delete',
	classNames: ['delete-container'],
	didInsertElement: function() {
		//reset name attributes
		this.get('controller').send('reset');
		var right = this.$().parent().width();
        this.$().css('left', right + 'px');
        this.$().animate({'left': '0px'}, {duration: 400,queue: false});
        //if this is the currently active trip, make sure the user knows
        this.get('controller').send('checkIfActive');
	},
	willDestroyElement: function() {
		var _this = this;
		var clone = this.$().clone();
        this.$().parent().append(clone);
        var left = this.$().width();
        clone.animate({'left': left + 'px'}, {duration: 200, queue: false, complete: function() {
        	_this.destroy();
        	clone.remove();
        }});
	}
});

module.exports = DeleteView;
},{}],48:[function(require,module,exports){
var EntryView = Ember.View.extend({
	classNames: ['trip-box'],
	mouseEnter: function() {
		var self = this;
		this.$().children('.trip').children('.overlay').children('.select').css('display', 'none');
		this.$().children('.trip').children('.overlay').children('.edit').css('display', 'none');
		this.$().children('.trip').children('.overlay').children('.delete').css('display', 'none');
		this.$().children('.trip').children('.overlay').children('.select').removeClass('animated fadeInDown fadeOutUp animated');
		this.$().children('.trip').children('.overlay').children('.delete').removeClass('animated fadeInRight fadeOutRight animated');
		setTimeout(function(){ 
			self.$().children('.trip').children('.overlay').children('.select').css('display', 'block');
			self.$().children('.trip').children('.overlay').children('.select').addClass('animated fadeInDown');
			self.$().children('.trip').children('.overlay').children('.delete').css('display', 'block');
			self.$().children('.trip').children('.overlay').children('.delete').addClass('animated fadeInRight');
		}, 10); 
	},
	mouseLeave: function() {
		this.$().children('.trip').children('.overlay').children('.select').addClass('animated fadeOutUp');
		this.$().children('.trip').children('.overlay').children('.delete').addClass('animated fadeOutRight');
	}
});

module.exports = EntryView;
},{}],49:[function(require,module,exports){
var TripsView = Em.View.extend({
	name: 'sidebar/trips_view',
	templateName: 'sidebar/trips',
	classNames: ['trips-container'],
	didInsertElement: function() {
		var left = 0 - this.$().parent().width();
        this.$().css('left', left + 'px');
      	this.$().animate({'left': '0px'}, {duration: 200,queue: false});
	},
	willDestroyElement: function() {
		var _this = this;
		var clone = this.$().clone();
        this.$().parent().append(clone);
        var width = 0 - this.$().width();
        clone.animate({'left': width + 'px'}, {duration: 400, queue: false, complete: function() {
        	_this.destroy();
        	clone.remove();
        }});
	}
});

module.exports = TripsView;
},{}],50:[function(require,module,exports){
var DetailsView = Em.View.extend({
	templateName: 'sidebar/waypoints/details',
	classNames: ['search-details-container'],
	didInsertElement: function() {
		this.get('controller').set('venue', null);
		this.get('controller').send('pull');
		var right = this.$().parent().width();
        this.$().css('left', right + 'px');
        this.$().animate({'left': '0px'}, {duration: 400,queue: false});
        this.$().children('.waypoint-result').children('.loading-overlay').css('display', 'table');
	},
	willDestroyElement: function() {
		this.get('controller').send('uncache');
		var _this = this;
		var clone = this.$().clone();
        this.$().parent().append(clone);
        var left = this.$().width();
        clone.animate({'left': left + 'px'}, {duration: 200, queue: false, complete: function() {
        	_this.destroy();
        	clone.remove();
        }});
	}
});

module.exports = DetailsView;
},{}],51:[function(require,module,exports){
var EditView = Em.View.extend({
	templateName: 'sidebar/waypoints/edit',
	classNames: ['waypoint-edit-container'],
	didInsertElement: function() {
		var right = this.$().parent().width();
        this.$().css('left', right + 'px');
        this.$().animate({'left': '0px'}, {duration: 400,queue: false});
        this.$().children('.waypoint-result').children('.loading-overlay').css('display', 'table');
	},
	willDestroyElement: function() {
		var _this = this;
		var clone = this.$().clone();
        this.$().parent().append(clone);
        var left = this.$().width();
        clone.animate({'left': left + 'px'}, {duration: 200, queue: false, complete: function() {
        	_this.destroy();
        	clone.remove();
        }});
	}
});

module.exports = EditView;
},{}],52:[function(require,module,exports){
var WaypointsView = Em.View.extend({
	name: 'sidebar/waypoints_view',
	templateName: 'sidebar/waypoints',
	classNames: ['waypoints-container']
});

module.exports = WaypointsView;
},{}],53:[function(require,module,exports){
var SidebarView = Em.View.extend({
	templateName: 'sidebar',
	elementId: 'sidebar',
	classNames: ['sidebar-container']
});

module.exports = SidebarView;
},{}],54:[function(require,module,exports){
var FriendsView = Em.View.extend({
	name: 'topbar/friends_view',
	templateName: 'topbar/friends',
	classNames: ['friends-container']
});

module.exports = FriendsView;
},{}],55:[function(require,module,exports){
var TriggerView = Em.View.extend({
	classNames: ['menu-item'],
	template: Em.Handlebars.compile("<div {{bind-attr class='view.icon'}}></div>"),
	click: function(evt) {
		var $menu = $('#topbar-menu'),
			_this = this;
		if($menu.hasClass('active')) {
			if($menu.data('context') === this.get('menu_context')) {
				//close the menu
				$menu.removeClass('active');
				$menu.data('context', null);
				if($('#sidebar-menu').data('fill') === true) {
					var sbw = $('#sidebar-menu').width();
					var nw = sbw + $menu.width();
					$('#sidebar-menu').animate({'width': nw+'px'},{duration:400, queue: false});
					$menu.animate({'right': (0 - this.get('width'))+'px'}, {duration: 400, queue: false});
					$('#map-canvas').css('right', '0px');
					$('#map-canvas').css('left', $(document).width()+'px');
				} else {
					$menu.animate({'right': (0 - this.get('width'))+'px'}, {duration: 400, queue: false});
					$('#map-canvas').animate({'right': '0px'}, {duration: 400, queue: false, step: function() {
						google.maps.event.trigger(_this.get('controller.controllers.map').get('map'), 'resize');
					}});
				}
			} else {
				this.get('controller').send('renderMenuElement', this.get('menu_context'), 'topbar-menu');
			}
		} else {
			//open the menu
			this.get('controller').send('renderMenuElement', this.get('menu_context'), 'topbar-menu');
			$menu.addClass('active');
			$menu.data('context', this.get('menu_context'));
			$menu.css('right', (0-this.get('width'))+'px');
			$menu.css('width', this.get('width')+'px');
			if($('#sidebar-menu').data('fill') === true) {
				var sbw = $('#sidebar-menu').width();
				var nw = sbw - ($menu.width()+1);
				$('#sidebar-menu').animate({'width': nw+'px'},{duration:400, queue: false});
				$menu.animate({'right': '0px'}, {duration: 400, queue: false});
				$('#map-canvas').css('right', this.get('width')+'px');
				$('#map-canvas').css('left', ($(document).width() - this.get('width'))+'px');
			} else {
				$menu.animate({'right': '0px'}, {duration: 400, queue: false});
				$('#map-canvas').animate({'right': this.get('width')+'px'}, {duration: 400, queue: false, step: function() {
					google.maps.event.trigger(_this.get('controller.controllers.map').get('map'), 'resize');
				}});
			}
		}
	}
});

module.exports = TriggerView;
},{}],56:[function(require,module,exports){
var TopbarView = Em.View.extend({
	templateName: 'topbar',
	elementId: 'topbar',
	classNames: ['topbar-container'],
	didInsertElement: function() {
		this.get('controller').send('get_gravatar');
	}
});

module.exports = TopbarView;
},{}],57:[function(require,module,exports){
var NotificationView = Em.View.extend({
	templateName: 'utils/notification',
	message: 'This is a message',
	title: 'New Private Message from Joe Bloggs',
	didInsertElement: function() {
			this.$().children().addClass('animated fadeIn');

	}
});

module.exports = NotificationView;
},{}]},{},[25])
;