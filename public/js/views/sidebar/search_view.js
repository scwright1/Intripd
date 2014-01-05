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
    		$input = $('#location-search-input'),
    		timerCheckCount = 0,
    		checkInputChange = function() {
        		timerCheckCount += 1;

        		if (lastValue !== $input.val()) {
        			//do the input change bit
        			var bounds = map.getBounds();
        			if($input.val() !== '') {
	        			request = {
	        				bounds: bounds,
	        				query: $input.val()
	        			};
	        			locationService.textSearch(request, callback);
        			}
        			else if($input.val() === '') {
        				$('.location-search-results').empty();
        				$('.location-search-results').append("<div class='location-search-results-entry no-entry'>No Results Found</div>");
        			}
            		lastValue = $input.val();
        		}
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
			  	$('.location-search-results').empty();
			    for (var i = 0; i < total; i++) {
			      var place = results[i];
			      $('.location-search-results').append("<a><div class='location-search-results-entry' onclick='setMarker(this); '><div class='place_image'></div><div class='place_text'><div class='place_name' data-value='"+place.name+"'>"+place.name+"</div><div class='place_address' data-value='"+place.formatted_address+"'>"+place.formatted_address+"</div></div><div class='place_type'></div><div class='place_id' data-value="+place.id+" hidden='hidden'></div><div class='place_ref' data-value="+place.reference+" hidden='hidden'></div><div class='place_lat' data-value="+place.geometry.location.nb+" hidden='hidden'></div><div class='place_lng' data-value="+place.geometry.location.ob+" hidden='hidden'></div></div></a>");
			    }
			  }
			}
	}
});

module.exports = SidebarSearchView;