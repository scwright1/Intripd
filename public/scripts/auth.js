$(document).ready(function(){
		$.support.placeholder = (function(){
    	var i = document.createElement('input');
    	return 'placeholder' in i;
	})();
	// Hide labels by default if placeholders are supported
	if($.support.placeholder) {
    	$('.auth-form-element-group').each(function(){
        	$(this).addClass('js-hide-label');
    	});
    	// Code for adding/removing classes here
    	$('.auth-form-element-group').find('input, textarea').on('keyup blur focus', function(e){
	    // Cache our selectors
	    var $this = $(this),
	        $parent = $this.parent();
	    // Add or remove classes
	    if (e.type == 'keyup') {
	        if( $this.val() == '' ) {
    			$parent.addClass('js-hide-label');
			} else {
    			$parent.removeClass('js-hide-label');
			}
	    }
	    else if (e.type == 'blur') {
	        if( $this.val() == '' ) {
    			$parent.addClass('js-hide-label');
			}
			else {
    			$parent.removeClass('js-hide-label').addClass('js-unhighlight-label');
			}
	    }
	    else if (e.type == 'focus') {
	        if( $this.val() !== '' ) {
    $parent.removeClass('js-unhighlight-label');
}
    	}
	});
	}
});