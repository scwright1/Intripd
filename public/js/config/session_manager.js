
var SessionManager = Ember.Object.extend({
	init: function() {
		this._super();
		this.set('token', $.cookie('ato'), {expires: 365});
		this.set('uid', $.cookie('uid'), {expires: 365});
		this.set('rem', false);
	},

	tokenChanged: function() {
		if(this.get('rem') === true) {
			$.cookie('ato', this.get('token'), {expires: 365});
		} else {
			$.cookie('ato', this.get('token'));
		}
	}.observes('token'),

	uidChanged: function() {
		if(this.get('rem') === true) {
			$.cookie('uid', this.get('uid'), {expires: 365});
		} else {
			$.cookie('uid', this.get('uid'));
		}
	}.observes('uid'),

	// Determine if the user is currently authenticated.
  	isAuthenticated: function() {
    	return !Ember.isEmpty(this.get('token')) && !Ember.isEmpty(this.get('uid'));
  	},

  	reset: function() {
	    App.__container__.lookup("route:application").transitionTo('auth.login');
	    Ember.run.sync();
	    Ember.run.next(this, function(){
	    	var tokenData = { tokenData: {token: this.get('token'), uid: this.get('uid') } };
	    	//destroy the session on the serverside database
	    	$.post('/api/sessions/destroy', tokenData);
	    	//doesn't really matter if it worked or not, destroy the cookies on the client side anyway
    	    this.set('token', '');
			$.removeCookie('ato');
			this.set('uid', '');
			$.removeCookie('uid');
			this.set('rem', false);
			Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
				if (!jqXHR.crossDomain) {
					jqXHR.setRequestHeader('X-AUTHENTICATION-TOKEN', null);
					jq.XHR.setRequestHeader('X-UID', null);
				}
			});
	    });
  	}
});

DS.rejectionHandler = function(reason) {
	if(reason === 401) {
		App.SessionManager.reset();
	}
	throw reason;
}

module.exports = SessionManager;