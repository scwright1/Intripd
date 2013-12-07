
SessionManager = Ember.Object.extend({
	init: function() {
		this._super();
		this.set('token', $.cookie('ato'));
		this.set('uid', $.cookie('uid'));
	}
});

module.exports = SessionManager;