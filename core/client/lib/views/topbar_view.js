var TopbarView = Em.View.extend({
	templateName: 'topbar',
	elementId: 'topbar',
	classNames: ['topbar-container'],
	didInsertElement: function() {
		this.get('controller').send('get_gravatar');
	}
});

module.exports = TopbarView;