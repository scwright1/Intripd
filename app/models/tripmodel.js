var mongoose 		= require('mongoose'),
	uuid 			= require('node-uuid');

var tripSchema = mongoose.Schema({
	uid: {type: String},
	creator_uid: {type: String},
	name: {type: String},
	creation_date: {type: Date},
	start_date: {type: Date},
	end_date: {type: Date},
	lat: {type: String},
	lng: {type: String},
	zoom: {type: Number}
});

tripSchema.statics.createTrip = function(uid, tripdata, done) {
	var Trip = this;
	if(!uid) {
		return done(400);
	} else {
		Trip.create({
			uid : uuid.v4(),
			creator_uid: uid,
			name : tripdata.name,
			creation_date : new Date(),
			start_date : tripdata.start_date,
			end_date : tripdata.end_date,
			lat : tripdata.lat,
			lng : tripdata.lng,
			zoom : tripdata.zoom
		}, function(err, t) {
			if(err) {
				return done(err);
			} else {
				var trip = {
					'uid': t.uid,
					'id': t._id,
					'creator_uid': t.creator_uid,
					'name': t.name,
					'creation_date': t.creation_date,
					'start_date': t.start_date,
					'end_date': t.end_date,
					'lat': t.lat,
					'lng': t.lng,
					'zoom': t.zoom
				};
				return done(200, trip);
			}
		});
	}
}
var Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;