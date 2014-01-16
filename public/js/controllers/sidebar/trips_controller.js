var SidebarTripsController = Ember.ArrayController.extend({
	needs: 'sidebar',
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
				self.send('loadTrips');
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
				$('.create_trip > .row > .col-xs-10 > table').empty();
				for(var i = 0; i < models.content.length; i++) {
					var record = models.content[i]._data;
					$('.create_trip > .row > .col-xs-10 > table').append('<tr><td>'+record.name+'</td></tr>');
				}
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
			}
			function reject(reason) {
				console.log(reason);
			}
		}
	}
});

module.exports = SidebarTripsController;