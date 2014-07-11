/**
 * SidebarSearchResultView
 */

var ResultView = Em.View.extend({
	templateName: 'sidebar/search/result',
	classNames: ['result'],
	click: function() {
		var self = this;
		var map = this.get('controller.controllers.map').get('map');
		var latlng = new google.maps.LatLng(self.get('content.location.lat'), self.get('content.location.lng'));
		map.setZoom(12);
		map.panTo(latlng);
		var marker = new google.maps.Marker({
      		position: latlng,
      		map: map,
      		title: this.get('content.name')
  		});

  		//now we create a temporary model in the store so that we can potentially save it out to the database should we want to:
  		this.get('controller').send('cache', self.get('content'));
	}
});

module.exports = ResultView;