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
				var doneInit = false;
				var noType = true;
				var t = self.get('tick');
				t += 1;
				self.set('tick', t);
				if((self.get('lastVal') !== $(input).val()) && (self.get('lastVal') !== '')) {
					noType = false;
					if($(input).val().length > 1) {
						doneInit = false;
						var request = {
							bounds: bounds,
							query: $(input).val()
						};
						locationService.textSearch(request, function(results, status) {
							if(status === google.maps.places.PlacesServiceStatus.OK) {
								var container = $('.location-search-results').height();
					            var count = container / 70;
					            var total = Math.round(count);
					            var raw = results.length;

					            //splice already stored results out
					            var stored = self.store.all('waypoint', App.Session.get('ac-tr'));
					            while(raw--) {
                					var b = results[raw];
                					for(var c = 0; c < stored.content.length; c++) {
                    					var e = stored.content[c]._data.sid;
                    					if(b.id === e) {
                        					results.splice(raw, 1);
                    					}
                					}
            					}
								self.set('searchResults', null);
								if(doneInit === false) {
									var sr = new Array();
									for(var i = 0; i < total; i++) {
										if(results[i] === undefined) {

										} else {
											sr[i] = {
												sid: results[i].id,
												reference: results[i].reference,
												name: results[i].name,
												address: results[i].formatted_address,
												lat: results[i].geometry.location.lat(),
												lng: results[i].geometry.location.lng(),
											};
										}
									}
								}
								self.set('searchResults', sr);
								noType = true;
								doneInit = true;
								if(doneInit === true) {
	                				if(results.length == 1) {
	                    				var pl = results[0];
	                    				getPhoto(pl.reference, noType);
					                } else {
					                    for(var j = 0; j < total; j++) {
					                        var pl = results[j];
					                        if(pl === undefined) {
					                            //do nothing
					                        } else {
					                        	if(noType !== false) {
					                        		getPhoto(pl.reference, noType);
					                        	}
					                        }
					                    }
					                } 
					            }

				                function getPhoto(place, noType) {
						            var request = {
						                reference: place
						            };
						            if(noType === false) {
                						return;
            						}
						            locationService.getDetails(request, function(details, status) {
						                if(status == google.maps.places.PlacesServiceStatus.OK) {
						                    var photo = '';
						                    var photos = details.photos;
						                    if(!photos) {
						                        //no photos for this location.  Moving on...
						                        $("#"+place+" > .place_image").empty();
						                        $("#"+place+" > .place_image").css('background', '#e4e4e4');
						                    } else {
						                        photo = photos[0].getUrl({'maxHeight': 56, 'maxWidth': 58});
						                        $("#"+place+" > .place_image > i").remove();
						                        $("#"+place+" > .place_image > img").attr('src', photo);
						                        $("#"+place+" > .place_image > img").show();
						                    }
						                    
						                } else if (status == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
						                    setTimeout(function(){getPhoto(place)},100);
						                }
						            });
        						}
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
		}
	}
});

module.exports = SidebarSearchController;