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