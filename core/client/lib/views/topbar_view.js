var TopbarView = Em.View.extend({
	templateName: 'topbar',
	classNames: ['topbar-container']
/*	didInsertElement: function() {
		var self = this;
		$('#user-quickbar > .topbar-icon').click(function() {
			var controller = self.get('controller');
			if($(this).data('context')) {
				var context = $(this).data('context');
				controller.set('trigger', this);
				controller.send('activate');
			}
		});

		$(window).resize(function() {
			if($('#social-content').hasClass('active')) {
				var right = $(document).width();
				$('#social-content').css('right', right+'px');
				var left = $(document).width() - $('#social-content').width();
				$('#social-content').css('left', left+'px');
			}
		});
	} */
});

module.exports = TopbarView;