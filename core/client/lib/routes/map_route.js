var MapRoute = App.AuthenticatedRoute.extend({
	actions: {
		renderMenuElement: function(element, location, model, search_key) {
			var controller = this.controllerFor(element);
			var m;
			if(search_key === 'c') {
				m = this.store.find(model, {creator_uid: App.Session.get('user_uid')});
			} else if(search_key === 't') {
				m = this.store.find(model, {trip_uid: App.Session.get('user_active_trip')});
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