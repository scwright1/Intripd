var SidebarMenuTriggerView = Em.View.extend({
	active: false,
	context: null,
	icon: null,
	width: null,
	classNames: ['menu-item'],
	classNameBindings: ['active'],
	template: Ember.Handlebars.compile("<div {{bind-attr class=':sidebar-icon view.icon'}}></div>"),
	click: function(evt) {
		var _this = this;
		var container = Em.View.views['sidebar-menu-content'];
		var viewIdentifier = _this.get('context').charAt(0).toUpperCase() + _this.get('context').slice(1);
		var viewName = "Sidebar"+viewIdentifier+"View";
		//check the current state of the menu system
		if(container.get('open')) {
			//menu is open
			if(container.get('menu') === this.get('context')) {
				//we've clicked the same menu, so close it
				_this.set('active', false);

				//this line must always be last
				container.set('open', false);
			} else {
				//change the menu
				container.set('size', this.get('width'));
				container.set('menu', this.get('context'));
				container.removeAllChildren();
				container.pushObject(window["App"][viewName].create());
				for(var i = 0; i < _this.get('parentView').get('childViews').length; i++) {
					_this.get('parentView').get('childViews').objectAt(i).set('active', false);
				}
				_this.set('active', true);
			}
		} else {
			//menu is not open, open the menu
			container.removeAllChildren();
			_this.set('active', true);
			container.set('menu', this.get('context'));
			container.set('size', this.get('width'));
			container.pushObject(window["App"][viewName].create());
			//this line must always be last
			container.set('open', true);
		}
	}
});

module.exports = SidebarMenuTriggerView;