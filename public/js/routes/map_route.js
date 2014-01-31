var MapRoute = App.AuthenticatedRoute.extend({
	marker: null,
	actions: {
		loadModule: function(module, mod, key, func) {
			//because we're not linking to the sidebar items via linkTo, we need to fire 
			//up their model pre-processing manually here
			var model = null;
			var controller = this.controllerFor(module);
			if(mod !== 'null') {
				if(key !== 'null') {
					//tofix - do not hardcode creator_uid
					if(key === 'c') {
						model = this.store.find(mod, {creator_uid: App.Session.get('uid')});
					} else if(key === 't') {
						model = this.store.find(mod, {trip_uid: App.Session.get('ac-tr')});
					}
				} else {
					model = this.store.find(mod, App.Session.get('uid'));
				}
				controller.set('model', model);
			}
			if(func !== 'null') {
				controller.send(func);
			}
			this.render(module, {into: 'sidebar', outlet: 'sidebar-content'});
		},
		dropMarker: function(sid, ref) {
			//markers.push(sid);
			var controller = this.controllerFor('waypoint');
			controller.set('el', ref);
			controller.set('sid', sid);
			controller.send('setup');

		},
		editMarker: function(marker, action) {
			this.set('marker', marker);
			var controller = this.controllerFor('sidebar');
			controller.set('act', action);
			controller.set('w', 350);
			controller.set('trigger', null);
			controller.send('menu');
			this.render('waypoint', {into: 'sidebar', outlet: 'sidebar-content'});
		}
	},
	setupController: function() {
		var self = this;
		//run-once: make sure the user has completed their profile
		var model_promise = self.store.find('profile', App.Session.get('uid'));
		var controller = self.controllerFor('sidebar.user');
		controller.set('model', model_promise);
		controller.send('initUserProfile');
		var extend = self.store.find('extend', App.Session.get('uid'));
		var extController = self.controllerFor('profile.user');
		extController.set('model', extend);
		extController.send('setup');
	},
	model: function() {
		return Ember.Object.create({});
	}
});


module.exports = MapRoute;