var DetailsController = Em.ObjectController.extend({
	venue: null,
	init: function() {
		if(App.Session.get('user_active_trip')) {
			this.set('trip_exists', false);
		} else {
			this.set('trip_exists', true);
		}
	},
	actions: {
		pull: function() {
			if(App.Session.get('user_active_trip')) {
				this.set('trip_exists', false);
			} else {
				this.set('trip_exists', true);
			}
			var self = this;
			$.ajax({
				url: '/api/search/foursquare',
				dataType: 'json',
				type: 'GET',
				data: {id: self.get('id')},
				success: function(data) {
					self.set('venue', data.response.venue);
					console.log(self.get('venue'));
					$('#sidebar-menu > .search-details-container > .waypoint-result > .loading-overlay').css('display', 'none');
				}
			});
		},
		uncache: function() {
			//simple removal of waypoints from cache
			this.store.unloadAll('waypoint');
		},
		addWaypoint: function() {
			//at the moment, this can be simple
			function f(model) {
				model.set('trip', App.Session.get('user_active_trip'));
				model.save().then(function() {
					//maybe do something?
				});
			}
			function r(reason) {
				console.log(reason);
			}
			var self = this;
			var point = this.get('store').find('waypoint', self.get('id'));
			point.then(f,r);
		}
	}
});

module.exports = DetailsController;