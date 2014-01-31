var SidebarTripsController = Ember.ArrayController.extend({
	needs: ['sidebar','waypoint'],
	ac_trip: null,
	name: '',
	start: '',
	end: '',
	w: null,
	trigger: null,
	actions: {
		menu: function() {
			var sidebarController = this.get('controllers.sidebar');
			sidebarController.set('w', this.get('w'));
			sidebarController.set('trigger', this.get('trigger'));
			sidebarController.send('navigate');
		},
		createTrip: function() {
			function convertDateToISO(dateString) {
				var rawDate = dateString.split('/');
				var date = new Date(rawDate[2],rawDate[1]-1,rawDate[0],0,0);
				return date;
			}
			var self = this;
			var startDate = convertDateToISO(this.get('start'));
			var endDate = convertDateToISO(this.get('end'));

			var trip = this.store.createRecord('trip', {
				name: this.get('name'),
				start_date: startDate,
				end_date: endDate,
				lat: map.getCenter().lat(),
				lng: map.getCenter().lng(),
				zoom: map.getZoom()
			});
			var promise = trip.save();
			promise.then(fulfill, reject);
			function fulfill(model) {
				App.Session.set('trip', model._data);
				App.Session.set('ac-tr', model._data.uid);
				$.cookie('ac-tr', model._data.uid, {expires:365});
				//self.send('loadTrips');
			}

			function reject(reason) {
				console.log(reason);
			}
		},
		loadTrips: function() {
			//load all trips into table for this user
			var trips = this.store.find('trip', {creator_uid: App.Session.get('uid')});
			trips.then(fulfill, reject);

			function fulfill(models) {
				$('#trips-list').empty();
				for(var i = 0; i < models.content.length; i++) {
					var record = models.content[i]._data;
					$('#trips-table > tbody').append('<tr><td>'+record.name+'</td></tr>');
				}
			}

			function reject(reason) {
				console.log(reason);
			}
		},
		info: function() {
			var active = this.store.find('trip', $.cookie('ac-tr'));
			var self = this;
			active.then(fulfill, reject);
			function fulfill(model) {
				self.set('ac_trip', model._data);
			}
			function reject(reason) {
				console.log(reason);
			}
		},
		setupActive: function() {
			var active = this.store.find('trip', $.cookie('ac-tr'));
			var self = this;
			active.then(fulfill, reject);
			function fulfill(model) {
				self.set('ac_trip', model._data);
				self.get('controllers.waypoint').send('pull');
			}
			function reject(reason) {
				console.log(reason);
			}
		},
		switch: function(trip) {
			var self = this;
			//switch out the currently active trip
			//firstly, remove the currently active trip;
			App.Session.set('ac-tr', null);
			$.cookie('ac-tr', '');
			//unload all waypoints currently stored (so we don't accidentally append waypoints to other trips)
			self.store.unloadAll('waypoint');
			//delete all markers currently active
			if(m.length > 0) {
				for(var i = 0; i < m.length; i++) {
					m[i].setMap(null);
				}
				m.length = 0;
			}

			//once we think this is null, go and generate the new points
			if((App.Session.get('ac-tr') !== null) || ($.cookie('ac-tr') !== '') || (m.length !== 0)) {
				alert("Something went wrong, we couldn't clear out the old trip!");
				alert(App.Session.get('ac-tr'));
				alert($.cookie('ac-tr'));
				alert(m.length);
			} else {
				$.cookie('ac-tr', trip._data.uid);
				App.Session.set('ac-tr', trip._data.uid);
				self.send('setupActive');
			}
		}
	}
});

module.exports = SidebarTripsController;