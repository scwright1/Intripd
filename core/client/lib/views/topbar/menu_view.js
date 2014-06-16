var TopbarMenuView = Em.ContainerView.extend({
	open: false,
	size: null,
	menu: null,
	classNames: ['social-menu-container'],
	menu_toggle: function() {
		var _this = this;
		var map = this.get('controller').get('map');
		if(this.get('open')) {
			//open the menu
			var right = 0 - this.get('size');
			this.$().css('right', right+'px');
			this.$().css('width', this.get('size')+'px');
			this.$().animate({'right': '0px'}, {duration: 400, queue: false});
			//also animate the map canvas to keep up with the moving div
			$('#map-canvas').animate({'right': this.get('size')+'px'}, {duration: 400, queue: false, step: function() {
				google.maps.event.trigger(map, 'resize');
			}});
		} else {
			//close the menu
			var right = 0 - this.get('size');
			this.$().animate({'right': right+'px'}, {duration: 400, queue: false});
			//also animate the map canvas to keep up with the div
			$('#map-canvas').animate({'right': '0px'}, {duration: 400, queue: false, step: function() {
				google.maps.event.trigger(map, 'resize');
			}});
		}
	}.observes('open'),
	didInsertElement: function() {
		var _this = this;
		$(window).resize(function() {
			if(_this.get('open')) {
				if(_this.get('size') === 'full') {
					//todo, handle social sidebar
					var width = $(window).width() - 80;
					_this.$().css('width', width+'px');
				}
			}
		});
	}
});

module.exports = TopbarMenuView;