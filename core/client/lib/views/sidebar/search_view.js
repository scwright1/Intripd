var SearchView = Em.View.extend({
	name: 'sidebar/search_view',
	templateName: 'sidebar/search',
	classNames: ['search-container'],
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