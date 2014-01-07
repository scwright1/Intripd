$(function() {
	$('#profile-init').modal({
		show: false,
		backdrop: 'static',
  		keyboard: false
	});
});

function setMarker(element) {
	var image = '../img/wpt.png';
	var latLng = new google.maps.LatLng($(element).children('.place_lat').data('value'), $(element).children('.place_lng').data('value'));
	var marker = new google.maps.Marker({
    	position: latLng,
      	map: map,
      	icon: image,
      	animation: google.maps.Animation.DROP,
      	title: $(element).children('.place_text').children('.place_name').data('value')
  	});
  	attachListener(marker, $(element).children('.place_text').children('.place_name').data('value'), $(element).children('.place_text').children('.place_address').data('value'));
    markers.push($(element).children('.place_id').data('value'));
    console.log(markers);
    map.panTo(latLng);
    $(element).remove();

}

function attachListener(marker, name, address) {
	google.maps.event.addListener(marker, 'click', function() {
        setMarkerContent(marker, name, address);
    });
}

function setMarkerContent(marker, name, address) {
	var content = name + ' ' + address;
	var iw = new google.maps.InfoWindow();
  	iw.setContent(content);
  	iw.open(map, marker);
}