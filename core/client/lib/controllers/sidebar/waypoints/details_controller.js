var DetailsController = Em.ObjectController.extend({
	venue: null,
	actions: {
		pull: function() {
			var self = this;
			$.ajax({
				url: '/api/search/foursquare',
				dataType: 'json',
				type: 'GET',
				data: {id: self.get('id')},
				success: function(data) {
					self.set('venue', data.response.venue);
					console.log(self.get('venue'));
				}
			});
		},
		uncache: function() {
			//simple removal of waypoints from cache
			this.store.unloadAll('waypoint');
		}
	}
});

module.exports = DetailsController;