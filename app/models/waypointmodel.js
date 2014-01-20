var mongoose 		= require('mongoose'),
	uuid 			= require('node-uuid');

var waypointSchema = mongoose.Schema({
	uid: {type: String},
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

var Waypoint = mongoose.model('Waypoint', waypointSchema);
module.exports = Waypoint;