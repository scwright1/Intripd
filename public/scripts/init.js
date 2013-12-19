$(function() {
	$('#profile-init').modal({
		show: false,
		backdrop: 'static',
  		keyboard: false
	});
});

function setMarker(element) {
	var marker = new google.maps.Marker({
    	position: new google.maps.LatLng($(element).children('.place_lat').data('value'), $(element).children('.place_lng').data('value')),
      	map: map,
      	title: $(element).children('.place_name').data('value')
  	});
}