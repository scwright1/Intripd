var SearchView = Em.View.extend({
	name: 'sidebar/search_view',
	templateName: 'sidebar/search',
	classNames: ['search-container'],
	didInsertElement: function() {
		var left = 0 - this.$().parent().width();
        this.$().css('left', left + 'px');
      	this.$().animate({'left': '0px'}, {duration: 200,queue: false});
	},
	willDestroyElement: function() {
		var _this = this;
		var clone = this.$().clone();
        this.$().parent().append(clone);
        var left = this.$().width();
        clone.animate({'left': (0-left) + 'px'}, {duration: 200, queue: false, complete: function() {
        	_this.destroy();
        	clone.remove();
        }});
	}
});

module.exports = SearchView;