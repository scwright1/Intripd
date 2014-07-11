var DetailsController = Em.ObjectController.extend({
	actions: {
		pull: function() {
			var self = this;
			$.ajax({
				url: '/api/waypoints',
				dataType: 'json',
				type: 'GET',
				data: {id: self.get('id')}
			});
		},
		uncache: function() {
			//simple removal of waypoints from cache
			this.store.unloadAll('waypoint');
		}
	}
});

module.exports = DetailsController;