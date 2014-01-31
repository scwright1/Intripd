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
	  	//self.get('controller').send('setupActive');
	}
});

module.exports = SidebarTripsView;