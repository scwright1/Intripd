var SidebarTripsView = Ember.View.extend({
	init: function() {
		this._super();
	},
	didInsertElement: function() {
		var self = this;
	  	$('#create_trip_form > .form-group > .date').datepicker({
	    	format: "dd/mm/yyyy",
	    	autoclose: true
	  	});
	  	//reset the info we're gathering for the currently active trip
	  	self.get('controller').send('info');
	}
});

module.exports = SidebarTripsView;