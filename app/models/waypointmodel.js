var mongoose 		= require('mongoose'),
	uuid 			= require('node-uuid');

var waypointSchema = mongoose.Schema({
	uid: {type: String},
	sid: {type: String},
	trip_uid: {type: String},
	creator_uid: {type: String},
	name: {type: String},
	creation_date: {type: Date},
	lat: {type: String},
	lng: {type: String},
	address: {type: String}
});

waypointSchema.statics.Create = function(uid, waypointData, done) {
	var waypoint = this;
	if(!uid) {
		return done(400);
	} else {
		Waypoint.create({
			uid : uuid.v4(),
			creator_uid: uid,
			sid: waypointData.sid,
			name : waypointData.name,
			creation_date : new Date(),
			lat : waypointData.lat,
			lng : waypointData.lng,
			address : waypointData.address,
			trip_uid : waypointData.trip_uid
		}, function(err, w) {
			if(err) {
				return done(err);
			} else {
				var wpt = {
					'uid': w.uid,
					'id': w._id,
					'sid': w.sid,
					'creator_uid': w.creator_uid,
					'name': w.name,
					'creation_date': w.creation_date,
					'trip_uid': w.trip_uid,
					'lat': w.lat,
					'lng': w.lng,
					'address': w.address
				};
				return done(200, w);
			}
		});
	}
}

waypointSchema.statics.getWaypoints = function(trip_uid, done) {
	var Waypoint = mongoose.model('Waypoint', waypointSchema);
	if(!trip_uid) {
		return done(400);
	} else {
		Waypoint.find({trip_uid: trip_uid}, function(err, waypoints) {
			if((err) || (waypoints === null)) {
				return done(400);
			} else {
				var w = new Array();
				for(var i = 0; i < waypoints.length; i++) {
					var tmp = {
					'uid': waypoints[i].uid,
					'id': waypoints[i]._id,
					'sid': waypoints[i].sid,
					'creator_uid': waypoints[i].creator_uid,
					'name': waypoints[i].name,
					'creation_date': waypoints[i].creation_date,
					'trip_uid': waypoints[i].trip_uid,
					'lat': waypoints[i].lat,
					'lng': waypoints[i].lng,
					'address': waypoints[i].address
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