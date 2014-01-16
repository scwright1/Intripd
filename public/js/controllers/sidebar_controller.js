var SidebarController = App.ApplicationController.extend({
	trigger: null,
	act: null,
	w: null,
	actions: {
		navigate: function() {
			//define the menu item
			var el = null;

			//work on the trigger element
			el = this.get('trigger');
			//make inactive if already active
			if($(el).hasClass('on')) {
				$(el).removeClass('on');
				this.set('act', 'close');
				this.send('menu');
			} else {
				//if any of the sibling elements are active, remove their active value then make current active
				if($(el).siblings().hasClass('on')) {
					$(el).siblings().removeClass('on');
					$(el).addClass('on');
					this.set('act', 'change');
					this.send('menu');
				} else {
					//just make current active
					$(el).addClass('on');
					this.set('act', 'open');
					this.send('menu');
				}
			}
		},
		menu: function() {
			var el, action, left, width = null;
			var self = this;

			action = self.get('act');
			el = self.get('trigger');
			left = $(el).parent().width();
			width = self.get('w');

			if(action === 'open') {
				var ml = left + width;
				$('#menu').css('width', width+'px');
				$('#menu').animate({'left': left+'px'}, {duration: 200, queue: false});
				$('#map-canvas').animate({'margin-left': ml+'px'}, {duration: 200, queue: false, complete: function() {google.maps.event.trigger(map, 'resize');}});
			} else if(action === 'close') {
				var cl = left - width;
				$('#menu').animate({'left': cl+'px'}, {duration: 200, queue: false});
				$('#map-canvas').animate({'margin-left': left+'px'}, {duration: 200, queue: false, complete: function() {google.maps.event.trigger(map, 'resize');}});
			} else if(action === 'change') {
				//change width of menu
				$('#menu').animate({'width': width+'px'}, {duration: 100, queue: false});
				//update map left-margin
				var cl = left + width;
				$('#map-canvas').animate({'margin-left': cl+'px'}, {duration: 100, queue: false, complete: function() {
					google.maps.event.trigger(map, 'resize');
				}});
			}
		},
		proof: function() {
			alert('proof');
		}
	}
});

module.exports = SidebarController;