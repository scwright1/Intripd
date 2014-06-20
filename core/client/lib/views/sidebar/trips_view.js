var TripsView = Em.View.extend({
	name: 'sidebar/trips_view',
	templateName: 'sidebar/trips',
	classNames: ['trips-container'],
	didInsertElement: function() {
		var left = 0 - this.$().parent().width();
        this.$().css('left', left + 'px');
      	this.$().animate({'left': '0px'}, {duration: 200,queue: false});
	},
	willDestroyElement: function() {
		var _this = this;
		var clone = this.$().clone();
        this.$().parent().append(clone);
        var width = 0 - this.$().width();
        clone.animate({'left': width + 'px'}, {duration: 400, queue: false, complete: function() {
        	_this.destroy();
        	clone.remove();
        }});
	}
});

module.exports = TripsView;