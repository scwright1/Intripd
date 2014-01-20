var WaypointController = App.ApplicationController.extend({
	el: null,
	marker: null,
	actions: {
		setup: function() {
			var element = '#'+this.get('el');
			var image = 'img/wpt.png';
			var lat = $(element).children('.place_lat').data('value');
			var lng = $(element).children('.place_lng').data('value');
			var name = $(element).children('.place_text').children('.place_name').data('value');
			var address = $(element).children('.place_text').children('.place_address').data('value');
			var latLng = new google.maps.LatLng(lat, lng);
			var marker = new google.maps.Marker({
		    	position: latLng,
		      	map: map,
		      	icon: image,
		      	animation: google.maps.Animation.DROP,
		      	title: name
		  	});
		  	map.panTo(latLng);
	    	$(element).remove();

	    	//set marker for saving out to db
	    	this.set('marker', {
		    	name: name,
		    	lat: lat,
		    	lng: lng,
		    	address: address,
		    	creator_uid: App.Session.get('uid'),
		    	trip_uid: App.Session.get('ac-tr')
		    });
		    this.send('push');
		},
		push: function() {
			var marker = this.store.createRecord('waypoint', this.get('marker'));
			var promise = marker.save();
			promise.then(fulfill, reject);
			function fulfill(model) {
				//load point for the ui element for the waypoint
			}

			function reject(reason) {
				console.log(reason);
			}
		}
	}
});

module.exports = WaypointController;