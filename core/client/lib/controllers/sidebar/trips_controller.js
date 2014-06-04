var SidebarTripsController = Ember.ArrayController.extend({
	needs: 'SidebarTripsCreate',
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
		}
	}
});

module.exports = SidebarTripsController;