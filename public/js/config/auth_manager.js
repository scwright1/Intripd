var User = require('../models/user');

var AuthManager = Ember.Object.extend({
	init: function() {
		this._super();
		var accessToken = $.cookie('access_token');
		var authUserId = $.cookie('auth_user');
		if(!Ember.isEmpty(accessToken) && !Ember.isEmpty(authUserId)) {
			this.authenticate(accessToken, authUserId);
		}
	},

	isAuthenticated: function() {
		return !Ember.isEmpty(this.get('apiKey.accessToken')) && !Ember.isEmpty(this.get('apiKey.user'));
	},

	authenticate: function(accessToken, userId) {
		$.ajaxSetup({
			headers: { 'Authorization': 'Bearer ' + accessToken }
		});
		var user = User.find(userId);
		this.set('apiKey', App.ApiKey.create({
			accessToken: accessToken,
			user: user
		}));
	},

	// Log out the user
  reset: function() {
    App.__container__.lookup("route:application").transitionTo('auth.login');
    Ember.run.sync();
    Ember.run.next(this, function(){
      this.set('apiKey', null);
      $.ajaxSetup({
        headers: { 'Authorization': 'Bearer none' }
      });
    });
  },

  // Ensure that when the apiKey changes, we store the data in cookies in order for us to load
  // the user when the browser is refreshed.
  apiKeyObserver: function() {
    if (Ember.isEmpty(this.get('apiKey'))) {
      $.removeCookie('access_token');
      $.removeCookie('auth_user');
    } else {
      $.cookie('access_token', this.get('apiKey.accessToken'));
      $.cookie('auth_user', this.get('apiKey.user.id'));
    }
  }.observes('apiKey')
});

// Reset the authentication if any ember data request returns a 401 unauthorized error
DS.rejectionHandler = function(reason) {
  if (reason.status === 401) {
    App.AuthManager.reset();
  }
  throw reason;
};

module.exports = AuthManager;