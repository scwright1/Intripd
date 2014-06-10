var SidebarTripsCreateView = Ember.View.extend({
	init: function() {
		this._super();
	},
	didInsertElement: function() {
		var _this = this;
		$('#trip-creation > .form-group > .input-group > .date').datepicker({
			format: 'dd/mm/yyyy',
			autoclose: true
		});
	},
});

module.exports = SidebarTripsCreateView;