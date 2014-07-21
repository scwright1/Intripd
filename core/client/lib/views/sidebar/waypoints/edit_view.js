var EditView = Em.View.extend({
	templateName: 'sidebar/waypoints/edit',
	classNames: ['waypoint-edit-container'],
	didInsertElement: function() {
		var right = this.$().parent().width();
        this.$().css('left', right + 'px');
        this.$().animate({'left': '0px'}, {duration: 400,queue: false});
	},
	willDestroyElement: function() {
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

module.exports = EditView;