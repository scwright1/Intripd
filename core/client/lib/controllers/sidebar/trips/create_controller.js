var SidebarTripsCreateController = Ember.ObjectController.extend({
	needs: ['sidebar'],
	content: [],
	actions: {
		create: function() {
			var self = this;
			function convertDateToISO(dateString) {
				var rawDate = dateString.split('/');
				var date = new Date(Date.UTC(rawDate[2],rawDate[1]-1,rawDate[0],0,0));
				return date.toISOString();
			}

			//gathering trip information
			var data = this.getProperties('tripname', 'departing', 'returning');
			if(!data.departing) {
				data.departing = "01/01/1970";
			}

			if(!data.returning) {
				data.returning = "01/01/1970";
			}

			//create record
			var trip = this.store.createRecord('trip', {
				name: data.tripname,
				start_date: convertDateToISO(data.departing),
				end_date: convertDateToISO(data.returning),
				creator_uid: App.Session.get('uid')
			});

			//persist the record
			var promise = trip.save();
			promise.then(fulfill, reject);
			function fulfill(model) {
				App.Session.set('trip', model._data);
				App.Session.set('user_active_trip', model._data.uid);
				self.set('tripname', null);
				self.set('departing', null);
				self.set('returning', null);
				var sidebar = self.get('controllers.sidebar');
				var trigger = $('.menu-item.active');
				sidebar.set('trigger', trigger);
				sidebar.send('activate');
				self.send('reset');
			}

			function reject(reason) {
				alert(reason);
			}
		},
		reset: function() {
			$('#trips-menu').animate({'left': '0px'},{duration: 400, queue: false});
			$('#create-trip-dialog').animate({'left': $(document).width()+'px'}, {duration: 400, queue: false});
		}
	}
});

module.exports = SidebarTripsCreateController;