var TopbarFriendsView = Em.View.extend({
	templateName: 'topbar/friends',
	word: null,
	controller: App.TopbarFriendsController.create(),
	didInsertElement: function() {
		this.set('word', this.get('controller').get('word'));
	}
});

module.exports = TopbarFriendsView;