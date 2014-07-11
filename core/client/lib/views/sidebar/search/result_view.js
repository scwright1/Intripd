/**
 * SidebarSearchResultView
 */

var ResultView = Em.View.extend({
	templateName: 'sidebar/search/result',
	classNames: ['result'],
	click: function() {
		var map = this.get('controller.controllers.map').get('map');
		var lat = this.get('content.location.lat');
		var lng = this.get('content.location.lng');
		map.setZoom(12);
		map.panTo(new google.maps.LatLng(lat,lng));
	}
});

module.exports = ResultView;