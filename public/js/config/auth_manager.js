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
	}
});

module.exports = AuthManager;