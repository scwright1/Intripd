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
					model = this.store.find(mod, {creator_uid: App.Session.get('uid')});
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
			markers.push(sid);
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
		//run-once: make sure the user has completed their profile
		var model_promise = this.store.find('profile', App.Session.get('uid'));
		var controller = this.controllerFor('sidebar.user');
		controller.set('model', model_promise);
		controller.send('initUserProfile');
	},
	model: function() {
		return Ember.Object.create({});
	}
});


module.exports = MapRoute;