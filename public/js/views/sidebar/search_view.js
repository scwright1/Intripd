var SidebarSearchView = Ember.View.extend({
	didInsertElement: function() {
		$('#location-search-input').focus(function() {
	    	// turn on timer
	    	startTimer();
		}).blur(function() {
	    	// turn off timer
	    	endTimer();
		});

		var lastValue = "",
            doneInit = false,
            noType = true,
    		$input = $('#location-search-input'),
    		timerCheckCount = 0,
    		checkInputChange = function() {
        		timerCheckCount += 1;
        		if (lastValue !== $input.val()) {
                    noType = false;
        			//do the input change bit
        			var bounds = map.getBounds();
        			if($input.val() !== '') {
                        if($input.val().length > 1) {
                            doneInit = false;
                            request = {
                                bounds: bounds,
                                query: $input.val()
                            };
                            locationService.textSearch(request, callback);
                        }
        			}
        			else if($input.val() === '') {
        				$('.location-search-results').empty();
        			}
        		}
                lastValue = $input.val();
    		},
    		timer = undefined,
    		startTimer = function() {
        		timer = setInterval(checkInputChange, 500); // check input field every 200 ms (1/5 sec)
    		},
    		endTimer = function() {
        		clearInterval(timer);
        		timerCheckCount = 0;
    		};

	    function callback(results, status) {
		  if (status == google.maps.places.PlacesServiceStatus.OK) {
            var resultsHeightContainer = $('.location-search-results').height();
            var totalResults = resultsHeightContainer / 70; //height of results div
            //round the result
            var total = Math.round(totalResults);
            var a = results.length;
            while(a--) {
                var b = results[a];
                for(var c = 0; c < markers.length; c++) {
                    var d = markers[c];
                    if(b.id === d) {
                        results.splice(a, 1);
                    }
                }
            }

		  	$('.location-search-results').empty();
            if(doneInit === false) {
                if (results.length == 1) {
                    var place = results[0];
                    $('.location-search-results').append("<a><div class='location-search-results-entry' id='search_result_"+ place.reference +"' onclick='setMarker(this);'><div class='place_image'><i class='fa fa-spinner fa-spin' style='margin: 21px; color: #e4e4e4'></i></div><div class='place_text'><div class='place_name' data-value='"+place.name+"'>"+place.name+"</div><div class='place_address' data-value='"+place.formatted_address+"'>"+place.formatted_address+"</div></div><div class='place_type'></div><div class='place_id' data-value="+place.id+" hidden='hidden'></div><div class='place_ref' data-value="+place.reference+" hidden='hidden'></div><div class='place_lat' data-value="+place.geometry.location.nb+" hidden='hidden'></div><div class='place_lng' data-value="+place.geometry.location.ob+" hidden='hidden'></div></div></a>");

                } else {
                    for (var i = 0; i < total; i++) {
                        var place = results[i];
                        if(place === undefined) {
                            //do nothing
                        } else {
                            $('.location-search-results').append("<a><div class='location-search-results-entry' id='search_result_"+ place.reference +"' onclick='setMarker(this);'><div class='place_image'><i class='fa fa-spinner fa-spin' style='margin: 21px; color: #e4e4e4'></i></div><div class='place_text'><div class='place_name' data-value='"+place.name+"'>"+place.name+"</div><div class='place_address' data-value='"+place.formatted_address+"'>"+place.formatted_address+"</div></div><div class='place_type'></div><div class='place_id' data-value="+place.id+" hidden='hidden'></div><div class='place_ref' data-value="+place.reference+" hidden='hidden'></div><div class='place_lat' data-value="+place.geometry.location.nb+" hidden='hidden'></div><div class='place_lng' data-value="+place.geometry.location.ob+" hidden='hidden'></div></div></a>");                           
                        }
                    }
                }
            }
            noType = true;
            doneInit = true;
            if(doneInit === true) {
                if(results.length == 1) {
                    var pl = results[0];
                    getPhoto(pl.reference);
                } else {
                    for(var j = 0; j < total; j++) {
                        var pl = results[j];
                        if(pl === undefined) {
                            //do nothing
                        } else {
                            getPhoto(pl.reference);
                        }
                    }
                }
            }
		  }
		}

        function getPhoto(place) {
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
                        $("#search_result_"+place+" > .place_image").empty();
                        $("#search_result_"+place+" > .place_image").css('background', '#e4e4e4');
                    } else {
                        photo = photos[0].getUrl({'maxHeight': 56, 'maxWidth': 58});
                        $("#search_result_"+place+" > .place_image").empty();
                        $("#search_result_"+place+" > .place_image").append("<img src='"+photo+"' height='56px' width='58px' />");
                    }
                    
                } else if (status == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
                    setTimeout(function(){getPhoto(place)},100);
                }
            });
        }
	}
});

module.exports = SidebarSearchView;