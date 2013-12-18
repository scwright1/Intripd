var MapRoute = App.AuthenticatedRoute.extend({
	actions: {
		loadModule: function(module) {
			this.render(module, {into: 'sidebar', outlet: 'sidebar-content'});
		}
	},
	setupController: function() {
		$('#profile-init').modal();
		var model_promise = this.store.find('profile', App.Session.get('uid'));
		var controller = this.controllerFor('sidebar.user');
		controller.set('model', model_promise);
		model_promise.then(fulfill, reject);
		function fulfill(model) {
			if(model.get('newUser') === true) {
				//get the user to update their profile
				console.log('about to do a thing');
				this.$('#profile-init').modal('show');
			}
		}
		function reject(reason) {
			App.Session.reset();
			this.transitionTo('index');
		}
		//controller.send('initUserProfile');
	},
	model: function() {
		return Ember.Object.create({});
	}
});

module.exports = MapRoute;