var SidebarMenuView = Em.ContainerView.extend({
	open: false,
	size: null,
	menu: null,
	triggered: false,
	classNames: ['sidebar-menu-container'],
	menu_toggle: function() {
		var _this = this;
		if(this.get('open')) {
			//open the menu
			var left = null;
			var width = null;
			if(this.get('size') === 'full') {
				width = $(document).width() - 80;
				left = 80 - ($(document).width() - 80);
			} else {
				width = this.get('size');
				left = 80 - this.get('size');
			}
			this.$().css('left', left+'px');
			this.$().css('width', width+'px');
			this.$().animate({'left': '80px'}, {duration: 400, queue: false, complete: function() {
				_this.set('triggered', true);
			}});
		} else {
			//close the menu
			if(this.get('size') === 'full') {
				left = 80 - ($(document).width() - 80);
			} else {
				left = 80 - this.get('size');
			}
			this.$().animate({'left': left+'px'}, {duration: 400, queue: false, complete: function() {
				_this.set('triggered', false);
			}});
		}
	}.observes('open'),
	menu_changed: function() {
		if(this.get('triggered')) {
			//only allow this action if the menu is already opened, otherwise it interferes with the open action
			if(this.$().width() !== this.get('size')) {
				//the size has changed, so change it
				if(this.get('size') === 'full') {
					//the size is full, so calculate it
					var width = $(document).width() - 80;
					this.$().animate({'width': width+'px'},{duration: 400, queue: false});
				} else {
					this.$().animate({'width': this.get('size')+'px'},{duration: 400, queue: false});
				}
			}
		}
	}.observes('menu'),
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

module.exports = SidebarMenuView;