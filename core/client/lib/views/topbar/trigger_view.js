var TriggerView = Em.View.extend({
	classNames: ['menu-item'],
	template: Em.Handlebars.compile("<div {{bind-attr class='view.icon'}}></div>"),
	click: function(evt) {
		var $menu = $('#topbar-menu'),
			_this = this;
		if($menu.hasClass('active')) {
			if($menu.data('context') === this.get('menu_context')) {
				//close the menu
				$menu.removeClass('active');
				$menu.data('context', null);
				$menu.animate({'right': (0 - this.get('width'))+'px'}, {duration: 400, queue: false});
				$('#map-canvas').animate({'right': '0px'}, {duration: 400, queue: false, step: function() {
					google.maps.event.trigger(_this.get('controller.controllers.map').get('map'), 'resize');
				}});
			} else {
				this.get('controller').send('renderMenuElement', this.get('menu_context'), 'topbar-menu');
			}
		} else {
			//open the menu
			this.get('controller').send('renderMenuElement', this.get('menu_context'), 'topbar-menu');
			$menu.addClass('active');
			$menu.data('context', this.get('menu_context'));
			$menu.css('right', (0-this.get('width'))+'px');
			$menu.css('width', this.get('width')+'px');
			$menu.animate({'right': '0px'}, {duration: 400, queue: false});
			$('#map-canvas').animate({'right': this.get('width')+'px'}, {duration: 400, queue: false, step: function() {
				google.maps.event.trigger(_this.get('controller.controllers.map').get('map'), 'resize');
			}});
		}
	}
});

module.exports = TriggerView;