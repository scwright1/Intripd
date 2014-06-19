var TriggerView = Em.View.extend({
	active: false,
	classNames: ['menu-item'],
	classNameBindings: ['active'],
	template: Ember.Handlebars.compile("<div {{bind-attr class='view.icon'}}></div>"),
	click: function() {
		var $menu = $('#sidebar-menu'),
			_this = this;
		if($menu.hasClass('active')) {
			if(_this.get('active')) {
				//this is the current active menu, so close
				this.set('active', false);
				$menu.removeClass('active');
				$menu.data('context', null);
				$menu.animate({'left': (80 - _this.get('width'))+'px'}, {duration: 400, queue: false});
				$('#map-canvas').animate({'left': '80px'}, {duration: 400, queue: false, step: function() {
					google.maps.event.trigger(_this.get('controller.controllers.map').get('map'), 'resize');
				}});
			} else {
				//new menu, change the content
				for(var i = 0; i < _this.get('parentView').get('childViews').length; i++) {
					_this.get('parentView').get('childViews').objectAt(i).set('active', false);
				}
				$menu.animate({'width': _this.get('width')+'px'}, {duration: 400, queue: false});
				$('#map-canvas').animate({'left': _this.get('width')+'px'}, {duration: 400, queue: false, step: function() {
					google.maps.event.trigger(_this.get('controller.controllers.map').get('map'), 'resize');
				}});
				this.get('controller').send('renderMenuElement', this.get('menu_context'), 'sidebar-menu');
			}
		} else {
			this.set('active', true);
			//open the menu
			this.get('controller').send('renderMenuElement', this.get('menu_context'), 'sidebar-menu');
			$menu.addClass('active');
			$menu.data('context', this.get('menu_context'));
			if(this.get('width') === 'full') {
				if($('#topbar-menu').hasClass('active')) {
					var w = $(document).width() - ($('#topbar-menu').width() + 81);
					_this.set('width', w);
				} else {
					var w = $(document).width() - 80;
					_this.set('width', w);
				}
			}
			$menu.css('left', (80-this.get('width'))+'px');
			$menu.css('width', this.get('width')+'px');
			$menu.animate({'left': '80px'}, {duration: 400, queue: false});
			var ml = parseInt(this.get('width')) + 80;
			$('#map-canvas').animate({'left': ml+'px'}, {duration: 400, queue: false, step: function() {
				google.maps.event.trigger(_this.get('controller.controllers.map').get('map'), 'resize');
			}});
		}
	}
});

module.exports = TriggerView;