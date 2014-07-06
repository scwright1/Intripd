var SearchController = Ember.ObjectController.extend({
	needs: ['map'],
	name: 'sidebar/search_controller',
	debug: false,
	search_term_cache: null,
	search_timestamp: null,
	waypointSearch: null,
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
					var now = +new Date;
					var term = self.get('search_term_cache');
					self.send('search', now, term);
				}
			}
		});
	}.observes('waypointSearch'),
	actions: {
		search: function(now, term) {
			var self = this;
			var then = this.get('search_timestamp');
			if(now !== then) {
				if(parseInt(now - then) < 1000) {
					setTimeout(function() {
						self.send('executeSearch', now, term);
					}, 1000);
				} else {
					self.send('executeSearch', now, term);
				}
			}
		},
		executeSearch: function(now, term) {
			var self = this;
			var current = this.get('search_term_cache');
			if(current === term) {
				$.ajax({
					type: 'POST',
					url: '/api/search',
					data: {term: current},
					dataType: 'json',
					complete: function() {
						self.set('search_timestamp', now);
					}
				});
			} else {
				return;
			}
		}
	}
});

module.exports = SearchController;