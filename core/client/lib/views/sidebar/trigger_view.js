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
				$menu.data('fill', false);
				$menu.removeClass('active');
				$menu.animate({'left': (80 - $menu.width())+'px'}, {duration: 400, queue: false});
				$('#map-canvas').animate({'left': '80px'}, {duration: 400, queue: false, step: function() {
					google.maps.event.trigger(_this.get('controller.controllers.map').get('map'), 'resize');
				}});
			} else {
				this.set('active', false);
				//new menu, change the content
				for(var i = 0; i < _this.get('parentView').get('childViews').length; i++) {
					_this.get('parentView').get('childViews').objectAt(i).set('active', false);
				}
				$menu.animate({'width': _this.get('width')+'px'}, {duration: 400, queue: false});
				$('#map-canvas').animate({'left': _this.get('width')+'px'}, {duration: 400, queue: false, step: function() {
					google.maps.event.trigger(_this.get('controller.controllers.map').get('map'), 'resize');
				}});
				if(this.get('menu_context') !== '') {
					this.get('controller').send('renderMenuElement', this.get('menu_context'), 'sidebar-menu');
				}
			}
		} else {
			var w;
			this.set('active', true);
			//open the menu
			this.get('controller').send('renderMenuElement', this.get('menu_context'), 'sidebar-menu');
			$menu.addClass('active');
			if(this.get('width') === 'full') {
				if($('#topbar-menu').hasClass('active')) {
					w = $(document).width() - ($('#topbar-menu').width() + 81);
				} else {
					w = $(document).width() - 80;
				}
			} else {
				w = this.get('width');
			}
			$menu.css('left', (80-w)+'px');
			$menu.css('width', w+'px');
			$menu.data('fill', true);
			$menu.animate({'left': '80px'}, {duration: 400, queue: false});
			var ml = parseInt(w) + 80;
			$('#map-canvas').animate({'left': ml+'px'}, {duration: 400, queue: false, step: function() {
				google.maps.event.trigger(_this.get('controller.controllers.map').get('map'), 'resize');
			}});
		}
	}
});

module.exports = TriggerView;