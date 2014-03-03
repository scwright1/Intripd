Ember.Handlebars.registerBoundHelper('tripdate', function(value) {
	//we shall manually parse the date so that it works on older browsers
	var iso = value;
	var date = generateDate(convertDate(iso));
	return new Handlebars.SafeString(date);
});

function convertDate(iso) {
	//assume ISO date in the format YYYY-MM-DDTHH:MM:SS-TT:ZZ
	var dateRegEx = /(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+).(\d+)Z/;
	var match = iso.match(dateRegEx);
	var comps = [], item, date;

	//if the iso date matches on the regex
	if(match) {
		for(var i = 1; i < match.length; i++) {
			comps.push(parseInt(match[i], 10));
		}
		return(new Date(comps[0], comps[1] - 1, comps[2]));
	}
}

function generateDate(date) {
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var dateSuffix, month;
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	dateSuffix = get_nth_suffix(d);
	month = months[m];

	return d+dateSuffix+" "+month+" "+y;
}

function get_nth_suffix(d) {
	switch(d) {
		case 1:
		case 21:
		case 31:
			return 'st';
		case 2:
		case 22:
			return 'nd';
		case 3:
		case 23:
			return 'rd';
		default:
			return 'th';
	}
}