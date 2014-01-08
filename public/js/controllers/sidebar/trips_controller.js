var SidebarTripsController = App.ApplicationController.extend({
	name: '',
	start: '',
	end: '',
	actions: {
		createTrip: function() {
			function convertDateToISO(dateString) {
				var rawDate = dateString.split('/');
				var date = new Date(rawDate[2],rawDate[1]-1,rawDate[0],0,0);
				return date;
			}

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
				App.Session.set('ac-tr', model._data.uid);
				$.cookie('ac-tr', model._data.uid, {expires:365});
			}

			function reject(reason) {
				alert('failed to save Trip.  Please Try Again!');
				console.log(reason);
			}
		}
	}
});

module.exports = SidebarTripsController;