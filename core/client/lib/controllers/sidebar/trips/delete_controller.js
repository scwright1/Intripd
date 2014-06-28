var SidebarTripsDeleteController = App.ApplicationController.extend({
	needs: ['map'],
	tripname: null,
	confirm: false,
	flash: null,
	actions: {
		reset: function() {
			this.set('tripname', null);
		},
		checkIfActive: function() {
			if(App.Session.get('user_active_trip') === this.get('model').get('uid')) {
				this.set('flash', 'Note: This is the current active trip!');
			} else {
				this.set('flash', null);
			}
		},
		delete_trip: function() {
			var self = this;
			//get the trip object from the database
			var uid = this.get('model').get('uid');
			var trip = this.store.find('trip', uid);
			trip.then(function(model) {
				model.deleteRecord();
				if(model.get('isDeleted')) {
					model.save();
					if(App.Session.get('user_active_trip') === uid) {
						App.Session.set('user_active_trip', '');
					}
					$('#sidebar-menu').data('fill', false);
					$('#sidebar-menu').removeClass('active');
					$('#sidebar-menu').animate({'left': (80 - $('#sidebar-menu').width())+'px'}, {duration: 400, queue: false});
					$('#map-canvas').animate({'left': '80px'}, {duration: 400, queue: false, step: function() {
						google.maps.event.trigger(self.get('controllers.map').get('map'), 'resize');
					}});
					$('#sidebar > .menu-item').each(function() {
						if($(this).hasClass('active')) {
							$(this).removeClass('active');
						}
					});
				}
			}, function(reason) {
				console.log(reason);
			});
		}
	},
	tripnameChanged: function() {
		var name = this.get('model').get('name');
		if(this.get('tripname') === name) {
			this.set('confirm', true);
		} else {
			this.set('confirm', false);
		}
	}.observes('tripname'),
	confirmed: function() {
		if(this.get('confirm')) {
			$('#delete-trip-button').prop('disabled', false);
		} else {
			$('#delete-trip-button').prop('disabled', true);
		}
	}.observes('confirm')
});

module.exports = SidebarTripsDeleteController;