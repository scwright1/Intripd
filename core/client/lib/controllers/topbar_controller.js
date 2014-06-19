var TopbarController = App.ApplicationController.extend({
	user_image: null,
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