var MapView = Ember.View.extend({
	template: Ember.TEMPLATES['map'],
	classNames: ['map-view'],
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
      		mapTypeId: google.maps.MapTypeId.ROADMAP
    	};
    	map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);
	},
	loadGoogleMaps: function() {
		var self = this;
		window.map_callback = function() {
    		self.initiateMap();
		}
		var script = document.createElement("script");
		script.type="text/javascript";
		script.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCaD6yRrIC4oscatZhkSumJTxdqXMzsoxM&sensor=true&callback=map_callback";
		var mapGlobal = document.getElementById('map-container');
		mapGlobal.appendChild(script);
	}
});

module.exports = MapView;