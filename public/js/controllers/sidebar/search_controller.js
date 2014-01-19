var SidebarSearchController = Ember.ArrayController.extend({
	needs: 'sidebar',
	input: null,
	lastVal: '',
	tick: 0,
	timer: null,
	searchResults: null,
	actions: {
		search: function() {
			this.set('timer', setInterval(searchTick, 200));
			var self = this;
			var input = this.get('input');
			var bounds = map.getBounds();
			function searchTick() {
				var t = self.get('tick');
				t += 1;
				self.set('tick', t);
				if((self.get('lastVal') !== $(input).val()) && (self.get('lastVal') !== '')) {
					if($(input).val().length > 1) {
						var request = {
							bounds: bounds,
							query: $(input).val()
						};
						locationService.textSearch(request, function(results, status) {
							if(status === google.maps.places.PlacesServiceStatus.OK) {
							//	var dat = self.store.all('search');
							//	for(var a = 0; a < dat.content.length; a++) {
							//		dat.content[a].deleteRecord();
							//	}
								self.set('searchResults', null);
							//	self.set('newData', 'start');
								var sr = new Array();
								for(var i = 0; i < results.length; i++) {
							//		self.store.createRecord('search', {
									sr[i] = {
										sid: results[i].id,
										reference: results[i].reference,
										name: results[i].name,
										address: results[i].formatted_address,
										lat: results[i].geometry.location.lat(),
										lng: results[i].geometry.location.lng()
									};
								}
								self.set('searchResults', sr);
							}
						});
					}
				} else if($(input).val() === '') {
					self.set('searchResults', null);
				}
				self.set('lastVal', $(input).val());
			}
		},
		clear: function() {
			clearInterval(this.get('timer'));
			this.set('tick', 0);
			console.log('tick off');
		}
	}
});

module.exports = SidebarSearchController;