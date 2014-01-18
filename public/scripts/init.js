$(function() {
	$('#profile-init').modal({
		show: false,
		backdrop: 'static',
  		keyboard: false
	});
});

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