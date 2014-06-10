var SidebarTripsController = Ember.ArrayController.extend({
	needs: ['sidebar'],
	trigger: null,
	trip: null,
	actions: {
		toggleTripsMenu: function() {
			$('#create-trip-dialog').css('left', ($('#menu-content').offset().left + $('#menu-content').width())+'px');
			$('#create-trip-dialog').css('width', $('menu-content').width()+'px');
			$('#trips-menu').animate({'left': (80-$(document).width())+'px'},{duration: 400, queue: false});
			$('#create-trip-dialog').animate({'left': '0px'}, {duration: 400, queue: false});
			return true;
		},
		reset: function() {
			$('#trips-menu').css('left', '0px');
			$('#create-trip-dialog').css('left', $(document).width()+'px');
		},
		generate: function() {
			this.set('trigger', 'create');
			this.send('toggleTripsMenu');
		},
		destroy: function(trip) {
			this.set('trigger', 'delete');
			this.set('trip', trip);
			this.send('toggleTripsMenu');
		},
		switch: function(trip) {
			var self = this;
			//switch out the currently active trip
			//firstly, remove the currently active trip;
			App.Session.set('user_active_trip', null);
			$.cookie('TRP_USERACTIVETRIP', '');
			//once we think this is null, go and generate the new points
			if((App.Session.get('user_active_trip') !== null) || ($.cookie('TRP_USERACTIVETRIP') !== '')) {
				alert("Something went wrong, we couldn't clear out the old trip!");
				alert(App.Session.get('user_active_trip'));
				alert($.cookie('TRP_USERACTIVETRIP'));
			} else {
				App.Session.set('trip', trip._data);
				App.Session.set('user_active_trip', trip._data.uid);
				var sidebar = self.get('controllers.sidebar');
				var trigger = $('.menu-item.active');
				sidebar.set('trigger', trigger);
				sidebar.send('toggleSidebarMenu');
			}
		}
	}
});

module.exports = SidebarTripsController;