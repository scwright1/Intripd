//require mongoose for mongodb access.  require hash for hashing passwords
var mongoose        = require('mongoose'),
    date            = new Date();

//create the base user schema
var extendSchema = mongoose.Schema({
    uid: {type: String},
    actr: {type: String},
    aclog: {type: String}
});

extendSchema.statics.getExtend = function(data, done) {
    var Extend = mongoose.model('Extend', extendSchema), uid = data;
    if(!uid) {
        return done(401);
    } else {
        Extend.findOne({uid: uid}, function(err, profile) {
            if((err) || (profile === null)) {
                return done(401);
            } else {
                var extend = {
                    'uid': profile.uid,
                    'id': profile._id,
                    'actr': profile.actr,
                    'aclog': profile.aclog
                };
                return done(extend);
            }
        });
    }
}

extendSchema.statics.updateExtend = function(id, data, done) {
    var Extend = mongoose.model('Extend', extendSchema);
    if(!id) {
        return done(401);
    } else {
        Extend.update({_id: id}, data.extend, function(){});
        return done(200);
    }
}

//create the User model
var Extend = mongoose.model('Extend', extendSchema);
module.exports = Extend;