var WaypointsController = Ember.ArrayController.extend({
	content: [],
	needs: ['map'],
	name: 'sidebar/waypoints_controller',
	actions: {
		plot: function() {
			var marker_index = this.get('controllers.map').get('markers');
			for (var i = 0; i < marker_index.length; i++) {
				marker_index[i].setMap(null);
			}
			var self = this;
			var data = this.get('content');
			Ember.run.later(function(){
				data.forEach(function(item){
					var ll = new google.maps.LatLng(item._data.lat, item._data.lng);
					var marker = new google.maps.Marker({
			      		position: ll,
			      		map: self.get('controllers.map').get('map'),
			      		title: item._data.name
			  		});
					marker_index.push(marker);
				});
			}, 500);
		}
	}
});

module.exports = WaypointsController;