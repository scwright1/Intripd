var MapView = Ember.View.extend({
	template: Ember.TEMPLATES['map'],
	classNames: ['map-view'],
	didInsertElement: function() {
		this._super();
		this.loadGoogleMaps();
	},
	willDestroyElement: function() {
		map = null;
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
		script.src="http://maps.googleapis.com/maps/api/js?key=AIzaSyCaD6yRrIC4oscatZhkSumJTxdqXMzsoxM&sensor=false&callback=map_callback";
		var mapGlobal = document.getElementById('map-container');
		mapGlobal.appendChild(script);
	}
});

module.exports = MapView;