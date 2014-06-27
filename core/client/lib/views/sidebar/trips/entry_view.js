var EntryView = Ember.View.extend({
	classNames: ['trip-box'],
	mouseEnter: function() {
		var self = this;
		this.$().children('.trip').children('.overlay').children('.select').css('display', 'none');
		this.$().children('.trip').children('.overlay').children('.edit').css('display', 'none');
		this.$().children('.trip').children('.overlay').children('.delete').css('display', 'none');
		this.$().children('.trip').children('.overlay').children('.select').removeClass('animated fadeInDown fadeOutUp animated');
		this.$().children('.trip').children('.overlay').children('.delete').removeClass('animated fadeInRight fadeOutRight animated');
		setTimeout(function(){ 
			self.$().children('.trip').children('.overlay').children('.select').css('display', 'block');
			self.$().children('.trip').children('.overlay').children('.select').addClass('animated fadeInDown');
			self.$().children('.trip').children('.overlay').children('.delete').css('display', 'block');
			self.$().children('.trip').children('.overlay').children('.delete').addClass('animated fadeInRight');
		}, 10); 
	},
	mouseLeave: function() {
		this.$().children('.trip').children('.overlay').children('.select').addClass('animated fadeOutUp');
		this.$().children('.trip').children('.overlay').children('.delete').addClass('animated fadeOutRight');
	}
});

module.exports = EntryView;