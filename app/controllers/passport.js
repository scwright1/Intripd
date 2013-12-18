//require local passport strategy and User model (already defined)
var mongoose		= require('mongoose'),
	LocalStrategy	= require('passport-local').Strategy,
	User 			= mongoose.model('User');

module.exports = function(passport) {

    //serialize user data so we can use it in the app based on the browser session
	passport.serializeUser(function(user, done) {
            done(null, user.id);
    });

    //deserialize the user data so we can work with it in database
    passport.deserializeUser(function(id, done) {
            User.findOne({ _id: id }, function (err, user) {
                    done(err, user);
            });
    });

    //setup the strategy (how we authenticate)
	passport.use(new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password'
    },

    //set the base function to be authUser 
    function(email, password, done) {
            User.authUser(email, password, done);
    }));
}