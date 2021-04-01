const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Reference to the Model to authenticate
const Users = require('../models/Users');

// Local Strategy - Local Log In
passport.use(
    new LocalStrategy(
        // By Default, passport waits for a user and password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await Users.findOne({
                    where: { 
                        email: email,
                        active: 1
                    }
                });
                
                // The user exists, but... The password is correct?
                //If doesn't exists:
                if(!user.checkPassword(password)){
                    return done(null, false, {
                        message: 'The password is incorrect'
                    });
                }

                // All Good
                return done(null, user);
            } catch(error) {
                // User does not exists
                return done(null, false, {
                    message: 'The account does not exists'
                });
            }
        }
    )
);

// Serialize user
passport.serializeUser((user, callback) => {
    callback(null, user);
});

// Deserialize user
passport.deserializeUser((user, callback) => {
    callback(null, user);
});

module.exports = passport;