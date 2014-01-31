var WaypointController = App.ApplicationController.extend({
	el: null,
	sid: null,
	marker: null,
	actions: {
		pull: function() {
			if(m.length > 0) {
				for(var a = 0; a < m.length; a++) {
					m[a].setMap(null);
				}
				m.length = 0;
			}
			var self = this;
			//load all waypoints into table for this trip
			var waypoints = this.store.find('waypoint', {trip_uid: App.Session.get('ac-tr')});
			waypoints.then(fulfill, reject);
			function fulfill(wps) {
				var image = 'img/wpt.png';
				for(var i = 0; i < wps.content.length; i++) {
					var record = wps.objectAt(i);
					var marker = new google.maps.Marker({
						position: new google.maps.LatLng(record._data.lat, record._data.lng),
						title: record._data.name,
						map: map,
						icon: image,
		      			animation: google.maps.Animation.DROP
					});
					m.push(marker);
					self.send('generatePoint', marker, record);
				}
			}

			function reject(reason) {
				console.log(reason);
			}
		},
		generatePoint: function(marker, model) {
			var self = this;
			google.maps.event.addListener(marker, 'click', function() {
				self.set('marker', model);
				$('#nb-vert > ul > li').each(function() {
					if($(this).data('menu') === 'waypoint') {
						$(this).addClass('on');
					} else {
						$(this).removeClass('on');
					}
				});
				self.get('target').send('editMarker', model, 'open');
			});
		},
		setup: function() {
			var self = this;
			var image = 'img/wpt.png';
			var element = '#'+this.get('el');
			var lat = $(element).children('.place_lat').data('value');
			var lng = $(element).children('.place_lng').data('value');
			var name = $(element).children('.place_text').children('.place_name').data('value');
			var address = $(element).children('.place_text').children('.place_address').data('value');
			var sid = $(element).children('.place_id').data('value');
			var latLng = new google.maps.LatLng(lat, lng);
			var marker = new google.maps.Marker({
		    	position: latLng,
		      	map: map,
		      	icon: image,
		      	animation: google.maps.Animation.DROP,
		      	title: name
		  	});
		  	m.push(marker);
		  	map.panTo(latLng);
	    	$(element).remove();

	    	//set marker for saving out to db
	    	var wpt = {
		    	name: name,
		    	sid: sid,
		    	lat: lat,
		    	lng: lng,
		    	address: address,
		    	creator_uid: App.Session.get('uid'),
		    	trip_uid: App.Session.get('ac-tr')
		    };
		    var wp = this.store.createRecord('waypoint', wpt);
			var promise = wp.save();
			promise.then(fulfill, reject);
			function fulfill(model) {
				//load point for the ui element for the waypoint
				google.maps.event.addListener(marker, 'click', function() {
					self.set('marker', model);
					$('#nb-vert > ul > li').each(function() {
						if($(this).data('menu') === 'waypoint') {
							$(this).addClass('on');
						} else {
							$(this).removeClass('on');
						}
					});
	    			self.get('target').send('editMarker', model, 'open');
	    		});
	    		self.set('marker', model);
	    		$('#nb-vert > ul > li').each(function() {
	    			if($(this).data('menu') === 'waypoint') {
	    				$(this).addClass('on');
	    			} else {
						$(this).removeClass('on');
	    			}
				});
	    		self.get('target').send('editMarker', model, 'change');
			}

			function reject(reason) {
				console.log(reason);
			}
		}
	}
});

module.exports = WaypointController;