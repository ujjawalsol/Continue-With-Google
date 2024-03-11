const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            console.error('Error during deserializeUser:', err);
            done(err);
        });
});

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Use the GOOGLE_CLIENT_ID variable from .env
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Use the GOOGLE_CLIENT_SECRET variable from .env
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id })
        .then(existingUser => {
            if (existingUser) {
                done(null, existingUser);
            } else {
                new User({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    profilePic: profile.photos[0].value
                    // ... rest of the user fields ...
                })
                .save()
                .then(user => done(null, user))
                .catch(err => {
                    console.error('Error during user creation:', err);
                    done(err);
                });
            }
        })
        .catch(err => {
            console.error('Error during user lookup:', err);
            done(err);
        });
}));

module.exports = passport;