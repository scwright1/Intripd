var NotificationController = Em.ObjectController.extend({
	content: [],
	needs: ['UtilsNotifications'],
	actions: {
		clear: function() {
			var list = this.get('controllers.UtilsNotifications').get('content');
			var index = list.findProperty('id', this.get('id'));
			list.removeObject(index);
		}
	}
});

module.exports = NotificationController;