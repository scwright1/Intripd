var SearchController = Ember.ArrayController.extend({
	needs: ['map'],
	search_term_cache: null,
	search_timestamp: null,
	waypointSearch: null,
	pending_searches: 0,
	searchScope: true,
	scope: 'global',
	results: [],
	searchTextChanged: function() {
		var self = this;
		$(document).keyup(function() {
			//rate limiting on search terms being sent to the server
			//
			//1.  Nothing is really shorter than 3 characters, so first of all, make sure that
			//the search term is > 3 characters in length
			//
			if(self.get('waypointSearch').length >= 3) {
				//
				//2.  Only check if the search term has changed (i.e. don't fire on typing somewhere else)
				//
				if(self.get('waypointSearch') !== self.get('search_term_cache')) {
					//
					//3.  Immediately update the term cache, so that we don't get duplicate ajax polls waiting
					//for the first one to complete
					//
					self.set('search_term_cache', self.get('waypointSearch'));
					//
					//4.  Search
					//
					self.send('search');
				}
			}
		});
	}.observes('waypointSearch'),
	pending: function() {
		//todo, processing div over search results
		if(this.get('pending_searches') > 0) {
			$('#sidebar-menu > .search-container > .search-results > .overlay').css('display', 'table');
		} else {
			$('#sidebar-menu > .search-container > .search-results > .overlay').css('display', 'none');
		}
	}.observes('pending_searches'),
	updateScope: function() {
		if(this.get('searchScope') === true) {
			this.set('scope', 'global');
		} else if(this.get('searchScope') === false) {
			this.set('scope', 'browse');
		}
	}.observes('searchScope'),
	/*dynamically changes the search scope based on the current zoom level of the map*/
	contextScope: function() {
		if(this.get('controllers.map.zoom') <= 10) {
			this.set('searchScope', true);
		} else {
			this.set('searchScope', false)
		}
	}.observes('controllers.map.zoom'),
	actions: {
		search: function() {
			var now = +new Date;
			var self = this;
			var then = this.get('search_timestamp');
			if(now !== then) {
				self.set('pending_searches', (self.get('pending_searches') +1));
				var term = self.get('search_term_cache');
				if(parseInt(now - then) < 2000) {
					setTimeout(function() {
						self.send('executeSearch', now, term);
					}, 2000);
				} else {
					self.send('executeSearch', now, term);
				}
			}
		},
		executeSearch: function(now, term) {
			var self = this;
			var current = this.get('search_term_cache');
			if(current === term) {
				var center = self.get('controllers.map').get('map').getCenter();
				var ll = center.lat()+','+center.lng();
				$.ajax({
					type: 'POST',
					url: '/api/search',
					data: {term: current, ll: ll, intent: self.get('scope')},
					dataType: 'json',
					success: function(data) {
						self.set('pending_searches', (self.get('pending_searches')-1));
						self.set('results', []);
						for(var i = 0; i < data.response.venues.length; i++) {
							var obj = (Em.Object.create(data.response.venues[i]));
							self.get('results').push(obj);
						}
					},
					complete: function() {
						self.set('search_timestamp', now);
					}
				});
			} else {
				self.set('pending_searches', (self.get('pending_searches')-1));
				return;
			}
		},
		cache: function(record) {
			this.get('store').createRecord('waypoint', {
				id: record.id,
	  			name: record.name,
	  			lat: record.location.lat,
	  			lng: record.location.lng
  			});
		}
	}
});

module.exports = SearchController;