var MarkerController = App.ApplicationController.extend({
	marker: null,
	actions: {
		push: function() {
			console.log(this.get('store'));
			//this.store.createRecord('marker', this.get('marker'));
		}
	}
});

module.exports = MarkerController;