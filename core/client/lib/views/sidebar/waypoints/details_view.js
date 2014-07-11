var DetailsView = Em.View.extend({
	templateName: 'sidebar/waypoints/details',
	classNames: ['search-details-container'],
	didInsertElement: function() {
		this.get('controller').send('pull');
		var right = this.$().parent().width();
        this.$().css('left', right + 'px');
        this.$().animate({'left': '0px'}, {duration: 400,queue: false});
	},
	willDestroyElement: function() {
		this.get('controller').send('uncache');
		var _this = this;
		var clone = this.$().clone();
        this.$().parent().append(clone);
        var left = this.$().width();
        clone.animate({'left': left + 'px'}, {duration: 200, queue: false, complete: function() {
        	_this.destroy();
        	clone.remove();
        }});
	}
});

module.exports = DetailsView;