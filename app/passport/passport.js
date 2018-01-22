var FacebookStrategy = require('passport-facebook').Strategy; 

var User = require('../models/user'); // Import User Model
var session = require('express-session'); // Import Express Session Package
var jwt = require('jsonwebtoken'); // Import JWT Package
var secret = 'kapil'; // Create custom secret to use with JWT

var User = require('../models/user')


module.exports = function(app,passport) {

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false } }));

    // Serialize users once logged in   
    passport.serializeUser(function (user, done) {
        // Check if the user has an active account
        if (user.active) {
            // Check if user's social media account has an error
            if (user.error) {
                token = 'unconfirmed/error'; // Set url to different error page
            } else {
                token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); // If account active, give user token
            }
        } else {
            token = 'inactive/error'; // If account not active, provide invalid token for use in redirecting later
        }
        done(null, user.id); // Return user object
    });

    // Deserialize Users once logged out    
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user); // Complete deserializeUser and return done
        });
    });


    passport.use(new FacebookStrategy({
        clientID: '1951597031825830', // Replace with your Facebook Developer App client ID
        clientSecret: '23a01fd593aaf516954822366264a9d1', // Replace with your Facebook Developer client secret
        callbackURL: "http://localhost:8000/auth/facebook/callback", // Replace with your Facebook Developer App callback URL
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
        function (accessToken, refreshToken, profile, done) {
            User.findOne({ email: profile._json.email }).select('username active password email').exec(function (err, user) {
                if (err) done(err);

                if (user && user !== null) {
                    done(null, user);
                } else {
                    done(err);
                }
            });
        }
    ));
    
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/facebookerror' }), function (req, res) {
        res.redirect('/facebook/' + token); 
    });

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
    
    return passport;
}