
SessionManager = Ember.Object.extend({
	init: function() {
		this._super();
		this.set('token', $.cookie('ato'));
		this.set('uid', $.cookie('uid'));
	},

	tokenChanged: function() {
		$.cookie('ato', this.get('token'));
	}.observes('token'),

	uidChanged: function() {
		$.cookie('uid', this.get('uid'));
	}.observes('uid'),

	// Determine if the user is currently authenticated.
  	isAuthenticated: function() {
    	return !Ember.isEmpty(this.get('token')) && !Ember.isEmpty(this.get('uid'));
  	},

  	reset: function() {
	    App.__container__.lookup("route:application").transitionTo('auth.login');
	    Ember.run.sync();
	    Ember.run.next(this, function(){
	    	//TODO - remove session from database
			this.set('token', '');
			$.removeCookie('ato');
			this.set('uid', '');
			$.removeCookie('uid');
			Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
  				if (!jqXHR.crossDomain) {
    				jqXHR.setRequestHeader('X-AUTHENTICATION-TOKEN', null);
  				}
			});
	    });
  	}
});

module.exports = SessionManager;