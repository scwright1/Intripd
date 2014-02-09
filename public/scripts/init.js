$(document).ready(function(){

  var $window = $(window);
  
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 2000);
        return false;
      }
    }
  });

  $('.section[data-type="background"]').each(function(){
      var $bgobj = $(this); // assigning the object
      $(window).scroll(function() {
          var yPos = -( ($window.scrollTop() - $bgobj.offset().top) / $bgobj.data('speed'));
           
          // Put together our final background position
          var coords = '50% '+ yPos + 'px';

          // Move the background
          $bgobj.css({ backgroundPosition: coords });
      });
  });
});

$(function() {
	$('#profile-init').modal({
		show: false,
		backdrop: 'static',
    keyboard: false
	});
});