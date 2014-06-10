var SidebarTripsView = Ember.View.extend({
	didInsertElement: function() {
		$('#trips-menu').css('left', '0px');
		$('#create-trip-dialog').css('left', $(document).width()+'px');
	}
});

module.exports = SidebarTripsView;