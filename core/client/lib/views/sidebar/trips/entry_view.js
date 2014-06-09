var SidebarTripsEntryView = Ember.View.extend({
	mouseEnter: function() {
		var uid = this.get('content')._data.uid;
		$('#'+uid+' > .overlay > .select').css('display', 'none');
		$('#'+uid+' > .overlay > .edit').css('display', 'none');
		$('#'+uid+' > .overlay > .delete').css('display', 'none');
		var $at = $('#'+uid+' > .overlay > .select').removeClass('animated fadeInDown fadeOutUp animated');
		var $at = $('#'+uid+' > .overlay > .edit').removeClass('animated fadeInLeft fadeOutLeft animated');
		var $at = $('#'+uid+' > .overlay > .delete').removeClass('animated fadeInRight fadeOutRight animated');  
		setTimeout(function(){ 
			$('#'+uid+' > .overlay > .select').css('display', 'block');
			$('#'+uid+' > .overlay > .select').addClass('animated fadeInDown');
			$('#'+uid+' > .overlay > .edit').css('display', 'block');
			$('#'+uid+' > .overlay > .edit').addClass('animated fadeInLeft');
			$('#'+uid+' > .overlay > .delete').css('display', 'block');
			$('#'+uid+' > .overlay > .delete').addClass('animated fadeInRight');
		}, 10); 
	},
	mouseLeave: function() {
		var uid = this.get('content')._data.uid;
		$('#'+uid+' > .overlay > .select').addClass('animated fadeOutUp');
		$('#'+uid+' > .overlay > .edit').addClass('animated fadeOutLeft');
		$('#'+uid+' > .overlay > .delete').addClass('animated fadeOutRight');
	}
});

module.exports = SidebarTripsEntryView;