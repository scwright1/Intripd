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
		var mapOptions = {
      		center: new google.maps.LatLng(26.055889, -5.989990),
      		zoom: 3,
      		mapTypeId: google.maps.MapTypeId.TERRAIN,
      		styles: [
    {
        "featureType": "water",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#acbcc9"
            }
        ]
    },
    {
        "featureType": "landscape",
        "stylers": [
            {
                "color": "#f2e5d4"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c5c6c6"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e4d7c6"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#fbfaf7"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c5dac6"
            }
        ]
    },
    {
        "featureType": "administrative",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 33
            }
        ]
    },
    {
        "featureType": "road"
    },
    {
        "featureType": "poi.park",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 20
            }
        ]
    },
    {},
    {
        "featureType": "road",
        "stylers": [
            {
                "lightness": 20
            }
        ]
    }
]
    	};
    	map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);
        //setup location search service
        locationService = new google.maps.places.PlacesService(map);
        geocodingService = new google.maps.Geocoder();
        this.getLocation();
        this.get('controller').controllerFor('waypoint').send('pull');
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