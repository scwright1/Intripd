var NotificationView = Em.View.extend({
	templateName: 'utils/notification',
	message: 'This is a message',
	title: 'New Private Message from Joe Bloggs',
	didInsertElement: function() {
			this.$().children().addClass('animated fadeIn');

	}
});

module.exports = NotificationView;