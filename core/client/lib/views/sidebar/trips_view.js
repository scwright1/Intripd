var SidebarTripsView = Ember.View.extend({
	name: 'trips',
	templateName: 'sidebar/trips-menu',
	didInsertElement: function() {
		$('#trips-menu').css('left', '0px');
		$('#create-trip-dialog').css('left', $(document).width()+'px');
	}
});

module.exports = SidebarTripsView;