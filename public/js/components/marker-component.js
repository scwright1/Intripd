var MarkerComponent = Ember.Component.extend({
	setup: function(element) {
		var store = this.get('store');
		console.log(store);
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
	  	attachListener(marker, name, address);
	    markers.push($(element).children('.place_id').data('value'));
	    map.panTo(latLng);
	    $(element).remove();
	    var controller = this.get('controller.marker');
	    controller.set('marker', {
	    	name: name,
	    	lat: lat,
	    	lng: lng,
	    	address: address,
	    	creator_uid: App.Session.get('uid'),
	    	trip_uid: App.Session.get('ac-tr')
	    });
	    controller.send('push');
	}
});

module.exports = MarkerComponent;