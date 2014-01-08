var SidebarTripsView = Ember.View.extend({
	didInsertElement: function() {
	  $('#create_trip_form > .form-group > .date').datepicker({
	    format: "dd/mm/yyyy",
	    autoclose: true
	  });
	}
});

module.exports = SidebarTripsView;