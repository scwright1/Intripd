var SidebarUserController = App.ApplicationController.extend({
	needs: 'sidebar',
	w: null,
	trigger: null,
	location: null,
	actions: {
		menu: function() {
			var sidebarController = this.get('controllers.sidebar');
			sidebarController.set('w', this.get('w'));
			sidebarController.set('trigger', this.get('trigger'));
			sidebarController.send('navigate');
		},
		profile: function() {
			return this.store.find('profile', App.Session.get('uid'));
		}.property(),
		initUserProfile: function() {
			var promise = this.store.find('profile', App.Session.get('uid'));
			promise.then(fulfill, reject);
			function fulfill(model) {
  				if(model.get('newUser') === true) {
  					//get the user to update their profile
  					this.$('#profile-init').modal('show');
  				}
			}
			function reject(reason) {
				App.Session.reset();
				this.transitionTo('index');
			}
		},
		connectFacebook: function() {
			$.getScript('//connect.facebook.net/en_UK/all.js', function(){
    			FB.init({appId: '179145525561301'});
    			FB.getLoginStatus(function(response) {
    				if(response.status === 'connected') {
    					console.log(response.authResponse.userID);
    					console.log(response.authResponse.accessToken);
    				} else if(response.status === 'not_authorized') {
    					alert('failed to authorize');
    				} else {
    					alert('general failure');
    				}
    			});
    		});
		}
	}
});

module.exports = SidebarUserController;