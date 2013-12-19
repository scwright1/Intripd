var Trip = DS.Model.extend({
	uid: DS.attr('string'),
	creator_uid: DS.attr('string'),
	name: DS.attr('string'),
	creation_date: DS.attr('string'),
	start_date: DS.attr('string'),
	end_date: DS.attr('string'),
	lat: DS.attr('string'),
	lng: DS.attr('string'),
	zoom: DS.attr('number')
});

module.exports = Trip;