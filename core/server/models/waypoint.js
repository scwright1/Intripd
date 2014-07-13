var mongoose 		= require('mongoose'),
	uuid 			= require('node-uuid');

var waypointSchema = mongoose.Schema({
	uid: {type: String},
	creator_uid: {type: String},
	name: {type: String},
	creation_date: {type: Date},
	lat: {type: String},
	lng: {type: String},
	trip: {type: String}
});

waypointSchema.statics.createWaypoint = function(creator_uid, data, done) {
	var Waypoint = this;
	if(!creator_uid) {
		return done(401);
	} else {
		Waypoint.create({
			uid: uuid.v4(),
			creator_uid: creator_uid,
			name: data.name,
			creation_date: new Date(),
			lat: data.lat,
			lng: data.lng,
			trip: data.trip
		}, function(err, w) {
			if(err) {
				return done(400);
			} else {
				return done(200);
			}
		});
	}
}

waypointSchema.statics.getWaypoints = function(trip_id, done) {
	var Waypoint = this;
	if(!trip_id) {
		return done(400, 'invalid Trip ID');
	} else {
		Waypoint.find({trip: trip_id}, function(err, waypoints) {
			if((err) || (waypoints === null)) {
				return done(400);
			} else {
				var w = new Array();
				for(var i = 0; i < waypoints.length; i++) {
					var tmp = {
						'uid': waypoints[i].uid,
						'id': waypoints[i].id,
						'creator_uid': waypoints[i].creator_uid,
						'name': waypoints[i].name,
						'creation_date': waypoints[i].creation_date,
						'lat': waypoints[i].lat,
						'lng': waypoints[i].lng
					};
					w.push(tmp);
				}
				return done(200, w);
			}
		});
	}
}


var Waypoint = mongoose.model('Waypoint', waypointSchema);
module.exports = Waypoint;