var ApplicationView = Ember.View.extend({
	classNames: ['map-view'],
	didInsertElement: function() {
		$.getScript('//connect.facebook.net/en_UK/all.js', function() {
            FB.init({
                appId      : '179145525561301',
                status     : true,
                xfbml      : true
            });
        });
	}
});

module.exports = ApplicationView;