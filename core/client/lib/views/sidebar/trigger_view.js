/**
 * Sidebar/trigger_view.js
 * View logic for the sidebar menu items to allow for insertion of the primary menus
 * Created: 19/Jun/2014
 */

var TriggerView = Em.View.extend({
	classNames: ['menu-item'],
	template: Ember.Handlebars.compile("<div {{bind-attr class='view.icon'}}></div>"),
	click: function() {

		var $m = $('#sidebar-menu'),
			$c = $('#map-canvas'),
			$t = $('#topbar-menu'),
			_t = this;

		if($m.hasClass('active')) {
			if(this.$().hasClass('active')) {
				//this is the current active menu, so close
				this.$().removeClass('active');
				$m.data('fill', false);
				$m.removeClass('active');
				$m.animate({'left': (80 - $m.width())+'px'}, {duration: 400, queue: false});
				$c.animate({'left': '80px'}, {duration: 400, queue: false, step: function() {
					google.maps.event.trigger(_t.get('controller.controllers.map').get('map'), 'resize');
				}});
			} else {
				//change the currently active menu
				for(var i = 0; i < _t.get('parentView').get('childViews').length; i++) {
					_t.get('parentView').get('childViews').objectAt(i).$().removeClass('active');
				}
				this.$().addClass('active');
				this.get('controller').send('renderMenuElement', this.get('menu_context'), 'sidebar-menu', this.get('model_context'), this.get('search_key'));
				if(this.get('width') === 'full') {
					$m.data('fill', true);
					//transition to full screen width
					if($t.hasClass('active')) {
						//fill up to social sidebar
						var w = ($(document).width() - ($t.width() + 81));
						var l = ($(document).width() - $t.width());
						$m.animate({'width': w+'px'}, {duration: 400, queue: false});
						$c.animate({'left': l+'px'}, {duration: 400, queue: false, step: function() {
							google.maps.event.trigger(_t.get('controller.controllers.map').get('map'), 'resize');
						}});
					} else {
						//social sidebar not open, so fill width
						var w = ($(document).width() - 80);
						$m.animate({'width': w+'px'}, {duration: 400, queue: false});
						$c.animate({'left': $(document).width()+'px'}, {duration: 400, queue: false, step: function() {
							google.maps.event.trigger(_t.get('controller.controllers.map').get('map'), 'resize');
						}});
					}
				} else {
					$m.data('fill', false);
					var l = parseInt(this.get('width')) + 80;
					$m.animate({'width': _t.get('width')+'px'}, {duration: 400, queue: false});
					$c.animate({'left': l+'px'}, {duration: 400, queue: false, step: function() {
						google.maps.event.trigger(_t.get('controller.controllers.map').get('map'), 'resize');
					}});
				}

			}
		} else {
			var w;
			this.$().addClass('active');
			//open the menu
			this.get('controller').send('renderMenuElement', this.get('menu_context'), 'sidebar-menu', this.get('model_context'), this.get('search_key'));
			$m.addClass('active');
			if(this.get('width') === 'full') {
				$m.data('fill', true);
				if($t.hasClass('active')) {
					w = $(document).width() - ($t.width() + 81);
				} else {
					w = $(document).width() - 80;
				}
			} else {
				w = this.get('width');
			}
			$m.css('left', (80-w)+'px');
			$m.css('width', w+'px');
			$m.animate({'left': '80px'}, {duration: 400, queue: false});
			var ml = parseInt(w) + 80;
			$c.animate({'left': ml+'px'}, {duration: 400, queue: false, step: function() {
				google.maps.event.trigger(_t.get('controller.controllers.map').get('map'), 'resize');
			}});
		}
	}
});

module.exports = TriggerView;