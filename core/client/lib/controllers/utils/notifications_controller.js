var NotificationsController = Em.ArrayController.extend({
	content: [
	Ember.Object.create({
		id: 886000000001,
		type: 'info',
		title: 'New Private Message',
		message: 'This is a message'
	}),
	Ember.Object.create({
		id: 886000000002,
		type: 'warning',
		title: 'New Information from God',
		message: 'You suck.  That is all.'
	})]
});

module.exports = NotificationsController;