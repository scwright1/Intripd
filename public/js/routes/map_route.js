var MapRoute = App.AuthenticatedRoute.extend({
	actions: {
		loadModule: function(module, mod, key, func) {
			this.render(module, {into: 'sidebar', outlet: 'sidebar-content'});
			//because we're not linking to the sidebar items via linkTo, we need to fire 
			//up their model pre-processing manually here
			var model = null;
			if(mod !== 'null') {
				if(key !== 'null') {
					//tofix - do not hardcode creator_uid
					model = this.store.find(mod, {creator_uid: App.Session.get('uid')});
				} else {
					model = this.store.find(mod, App.Session.get('uid'));
				}
				var controller = this.controllerFor(module);
				controller.set('model', model);

				if(func !== 'null') {
					controller.send(func);
				}
			}
		},
		loadItemMenu: function() {
			if($('#content-menu').hasClass('open')) {
				var start = $('#content-menu').position().left;
				var endpoint = (start + $('#content-menu').width());
				$('#item-specific-menu').css('left', endpoint+'px');
			}
			var width = $('#map-canvas').width() / 2;
			$('#item-specific-menu').animate({'width':width+'px'}, {duration: 200, queue: false});
			$('#item-specific-menu').addClass('open');
		}
	},
	setupController: function() {
		//run-once: make sure the user has completed their profile
		var model_promise = this.store.find('profile', App.Session.get('uid'));
		var controller = this.controllerFor('sidebar.user');
		controller.set('model', model_promise);
		controller.send('initUserProfile');
	},
	model: function() {
		return Ember.Object.create({});
	}
});


module.exports = MapRoute;