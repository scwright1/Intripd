var MapController = App.ApplicationController.extend({
	actions: {
		pollData: function() {
			var data = { data: { d: 'dummy' } };
			$.post('/api/map/data', data).then(function(response){
				console.log(response);
			});
		}
	}
});

module.exports = MapController;