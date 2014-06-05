var MapRoute = App.AuthenticatedRoute.extend({
	actions: {
		loadMenu: function(module, model, key, pass) {
			var m = null;
			var controller = this.controllerFor(module);
			if(model !== 'null') {
				if(key !== 'null') {
					if(key === 'user') {
						m = this.store.find(model, {creator_uid: App.Session.get('user_uid')});
					} else if(key === 'trip') {
						m = this.store.find(model, {trip_uid: App.Session.get('user_active_trip')});
					}
					controller.set('model', m);
				} else {
					m = this.store.find(model, App.Session.get('user_uid'));
				}
			}
			this.render(module, {into: 'sidebar', outlet: 'menu-content'});
		}
	},
	model: function() {
		return Ember.Object.create({});
	}
});

module.exports = MapRoute;