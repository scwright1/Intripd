var mongoose 		= require('mongoose'),
	uuid 			= require('node-uuid');

var tripSchema = mongoose.Schema({
	trip_uid: {type: String},
	creator_uid: {type: String},
	name: {type: String},
	creation_date: {type: Date},
	start_date: {type: Date},
	end_date: {type: Date},
	center_lat: {type: String},
	center_lng: {type: String},
	zoom_level: {type: Number}
});

tripSchema.statics.createTrip = function(uid, tripdata, done) {
	var Trip = this;
	if(!uid) {
		return done(400);
	} else {
		Trip.create({
			trip_uid : uuid.v4(),
			creator_uid: uid,
			name : tripdata.name,
			creation_date : new Date(),
			start_date : tripdata.start_date,
			end_date : tripdata.end_date,
			center_lat : tripdata.lat,
			center_lng : tripdata.lng,
			zoom_level : tripdata.zoom
		}, function(err, trip) {
			if(err) {
				return done(err);
			} else {
				return done(200, trip);
			}
		});
	}
}
var Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;