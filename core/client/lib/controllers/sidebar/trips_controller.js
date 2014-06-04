var SidebarTripsController = Ember.ArrayController.extend({
	needs: ['SidebarTripsCreate','sidebar'],
	actions: {
		initCreate: function() {
			//todo - create a trip, assign it to a user and make it active
			$('#create-trip-dialog').css('left', ($('#menu-content').offset().left + $('#menu-content').width())+'px');
			$('#create-trip-dialog').css('width', $('menu-content').width()+'px');
			$('#trips-menu').animate({'left': (80-$(document).width())+'px'},{duration: 400, queue: false});
			$('#create-trip-dialog').animate({'left': '0px'}, {duration: 400, queue: false});
		},
		cancelCreate: function() {
			$('#trips-menu').animate({'left': '0px'},{duration: 400, queue: false});
			$('#create-trip-dialog').animate({'left': $(document).width()+'px'}, {duration: 400, queue: false});
		},
		create: function() {
			var self = this;
			function convertDateToISO(dateString) {
				var rawDate = dateString.split('/');
				var date = new Date(Date.UTC(rawDate[2],rawDate[1]-1,rawDate[0],0,0));
				return date.toISOString();
			}

			//gathering trip information
			var controller = this.get('controllers.SidebarTripsCreate');
			var data = controller.getProperties('tripname', 'departing', 'returning');

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
				controller.set('tripname', null);
				controller.set('departing', null);
				controller.set('returning', null);
				var sidebar = self.get('controllers.sidebar');
				var trigger = $('.menu-item.active');
				sidebar.set('trigger', trigger);
				sidebar.send('activate');
			}

			function reject(reason) {
				alert(reason);
			}
		}
	}
});

module.exports = SidebarTripsController;