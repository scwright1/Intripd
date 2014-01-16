var SidebarTripsView = Ember.View.extend({
	init: function() {
		this._super();
	},
	didInsertElement: function() {
	  $('#create_trip_form > .form-group > .date').datepicker({
	    format: "dd/mm/yyyy",
	    autoclose: true
	  });
	  this.get('controller').send('setupActive');
	}
});

module.exports = SidebarTripsView;