var MapRoute = App.AuthenticatedRoute.extend({
	actions: {
		loadModule: function(module) {
			//load a valid view template into the view
			this.render(module, 
				{
					into: 'sidebar',
					outlet: 'sidebar-content'
				});
		}
	}
});

module.exports = MapRoute;