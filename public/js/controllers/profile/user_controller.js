var ProfileUserController = App.ApplicationController.extend({
	actions: {
		setup: function() {
			var model = this.get('model');
			model.then(f,r);
			function f(m) {
				App.Session.set('ac-tr', m._data.actr);
				$.cookie('ac-tr', m._data.actr);
			}

			function r(reason) {
				alert(reason);
			}
		}
	}
});

module.exports = ProfileUserController;