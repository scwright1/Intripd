var MapView = Ember.View.extend({
	template: Ember.TEMPLATES['map'],
	classNames: ['map-view'],
    location: null,
	didInsertElement: function() {
		var self = this;
		self._super();
		self.loadGoogleMaps();
	},
	willDestroyElement: function() {
		map = null;
		window.location.reload();
	},
	initiateMap: function() {
        google.maps.visualRefresh = true;
		var mapOptions = {
      		center: new google.maps.LatLng(26.055889, -5.989990),
      		zoom: 3,
      		mapTypeId: google.maps.MapTypeId.ROADMAP,
      		styles: [{"featureType":"water","stylers":[{"saturation":43},{"lightness":-11},{"hue":"#0088ff"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":99}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ece2d9"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#ccdca1"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#b8cb93"}]},{"featureType":"poi.park","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","stylers":[{"visibility":"simplified"}]}]
    	};
    	map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);
        //setup location search service
        locationService = new google.maps.places.PlacesService(map);
        geocodingService = new google.maps.Geocoder();
        this.getLocation();
        if(App.Session.get('ac-tr') !== null) {
            this.get('controller').controllerFor('waypoint').send('pull');
        }
	},
	loadGoogleMaps: function() {
		var self = this;
		window.map_callback = function() {
    		self.initiateMap();
		}
		var script = document.createElement("script");
		script.type="text/javascript";
        //?key=AIzaSyCaD6yRrIC4oscatZhkSumJTxdqXMzsoxM
		script.src="https://maps.googleapis.com/maps/api/js?sensor=true&libraries=places&callback=map_callback";
		var mapGlobal = document.getElementById('map-container');
		mapGlobal.appendChild(script);
	},
    getLocation: function() {
        var self = this;
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(self.showPosition);
        } else {
            console.log('Geolocation is not supported by this browser');
        }
    },
    showPosition: function(position) {
        var self = this;
        var image = 'img/home-marker.png';
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var userPosition = new google.maps.LatLng(lat,lng);
        geocodingService.geocode({'latLng': userPosition}, function(results, status) {
            if(status == google.maps.GeocoderStatus.OK) {
                if(results[1]) {
                    marker = new google.maps.Marker({
                        icon: image,
                        position: userPosition,
                        map: map
                    });
                    loc = results[3].formatted_address;
                }
            } else {
            }
        });
    }
});

module.exports = MapView;