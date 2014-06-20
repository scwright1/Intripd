var CreateView = Ember.View.extend({
	templateName: 'sidebar/trips/create',
	classNames: ['create-container'],
	didInsertElement: function() {
		//reset name attributes
		this.get('controller').send('reset');
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

module.exports = CreateView;