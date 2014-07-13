var MapRoute = App.AuthenticatedRoute.extend({
	actions: {
		renderMenuElement: function(element, location, model, search_key, tuid) {
			var controller = this.controllerFor(element);
			var m;
			if(search_key === 'c') {
				m = this.store.find(model, {creator_uid: App.Session.get('user_uid')});
			} else if(search_key === 't') {
				if(tuid) {
					m = this.store.find(model, tuid);
				} else {
					m = this.store.find(model, {trip: App.Session.get('user_active_trip')});
				}
			} else if(search_key === 'wl') {
				m = this.store.find(model, tuid);
			}
			controller.set('model', m);
			this.render(element, {into: location, outlet: 'menu'});
		}
	},
	model: function() {
		return Ember.Object.create({});
	}
});

module.exports = MapRoute;