var MapView = Em.View.extend({
	classNames: ['fill-window'],
	didInsertElement: function() {
		this._super();
		this.loadMap();
	},
	willDestroyElement: function() {
		this.set('controller.map', null);
		window.location.reload();
	},
	loadMap: function() {
		var self = this;
		window.map_callback = function() {
			self.initializeMap();
		}
		var script = document.createElement("script");
		script.type="text/javascript";
        //?key=AIzaSyCaD6yRrIC4oscatZhkSumJTxdqXMzsoxM
		script.src="https://maps.googleapis.com/maps/api/js?sensor=true&libraries=places&callback=map_callback";
		var mapGlobal = document.getElementById('map');
		mapGlobal.appendChild(script);
	},
	initializeMap: function() {
		google.maps.visualRefresh = true;
		var mapOptions = {
      		center: new google.maps.LatLng(26.055889, -5.989990),
      		zoom: 3,
      		mapTypeId: google.maps.MapTypeId.ROADMAP,
      		disableDefaultUI: true,
      		styles: [{"featureType": "landscape.natural","elementType": "geometry.fill","stylers": [{"color": "#f5f5f2"},{"visibility": "on"}]},{"featureType": "administrative.province","stylers": [{"visibility": "off"}]},{"featureType": "transit","stylers": [{"visibility": "off"}]},{"featureType": "poi","stylers": [{"visibility": "simplified"}]},{"featureType": "poi.attraction","stylers": [{"visibility": "off"}]},{"featureType": "landscape.man_made","elementType": "geometry.fill","stylers": [{"color": "#ffffff"},{"visibility": "on"}]},{"featureType": "poi.business","stylers": [{"visibility": "off"}]},{"featureType": "poi.medical","stylers": [{"visibility": "off"}]},{"featureType": "poi.place_of_worship","stylers": [{"visibility": "off"}]},{"featureType": "poi.school","stylers": [{"visibility": "off"}]},{"featureType": "poi.sports_complex","stylers": [{"visibility": "off"}]},{"featureType": "road.highway","elementType": "geometry","stylers": [{"color": "#ffffff"},{"visibility": "simplified"}]},{"featureType": "road.arterial","stylers": [{"visibility": "simplified"},{"color": "#ffffff"}]},{"featureType": "road.highway","elementType": "labels.icon","stylers": [{"color": "#ffffff"},{"visibility": "off"}]},{"featureType": "road.highway","elementType": "labels.icon","stylers": [{"visibility": "off"}]},{"featureType": "road.arterial","stylers": [{"color": "#ffffff"}]},{"featureType": "road.local","stylers": [{"color": "#ffffff"}]},{"featureType": "poi.park","elementType": "labels.icon","stylers": [{"visibility": "off"}]},{"featureType": "water","stylers": [{"color": "#71c8d4"}]},{"featureType": "landscape","stylers": [{"color": "#e5e8e7"}]},{"featureType": "poi.park","stylers": [{"color": "#8ba129"}]},{"featureType": "road","stylers": [{"color": "#ffffff"}]},{"featureType": "poi.sports_complex","elementType": "geometry","stylers": [{"color": "#c7c7c7"},{"visibility": "off"}]},{"featureType": "water","stylers": [{"color": "#a0d3d3"}]},{"featureType": "poi.park","stylers": [{"color": "#91b65d"}]},{"featureType": "poi.park","stylers": [{"gamma": 1.51}]},{"featureType": "road.local","stylers": [{"visibility": "off"}]},{"featureType": "road.local","elementType": "geometry","stylers": [{"visibility": "on"}]},{"featureType": "poi.government","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "landscape","stylers": [{"visibility": "off"}]},{"featureType": "road","elementType": "labels","stylers": [{"visibility": "off"}]},{"featureType": "road.arterial","elementType": "geometry","stylers": [{"visibility": "simplified"}]},{"featureType": "road.local","stylers": [{"visibility": "simplified"}]},{"featureType": "road"},{"featureType": "road"},{},{"featureType": "road.highway"}]
    	};
    	this.set('controller.map', new google.maps.Map(document.getElementById("map-canvas"),mapOptions));
    	google.maps.event.trigger(this.get('controller.map'), 'resize');
	}
});

module.exports = MapView;