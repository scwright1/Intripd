var SidebarWaypointsController = Ember.ArrayController.extend({
	needs: ['waypoint'],
	actions: {
		select: function(w) {
			//got the model from clicking the entry (and using the action helper) as "w", no need to look up again
			var _this = this;
			//set the waypoint data to be the model information
			var waypointController = _this.get('controllers.waypoint');
			waypointController.set('marker', w);
			//issue the change function against the route
			_this.get('target').send('editMarker', w, 'change');
			map.setCenter(new google.maps.LatLng(w._data.lat, w._data.lng));
			map.setZoom(13);
		}
	}

});

module.exports = SidebarWaypointsController;