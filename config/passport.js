const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user');
const keys = require('./keys');
// strategies
const localStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;


module.exports = function(passport) {
  // local strategy
  passport.use(new localStrategy(
    // use email instead of username (passports default)
    { usernameField: 'email' },
    (email, password, done) => {
      // check if user exists in the database
      User.findOne({ email })
        .then((user) => {
          // user doesn't exist
          if(!user) {
            return done(null, false, { message: 'no user found' });
          }
          // check the password
          bcrypt.compare(password, user.password, (err, matches) => {
            if(err) {
              next(err);
            }
            // clheck if passwords match
            if(matches) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        });
    }
  ));

  // google strategy
  passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true // needed for Heroku
  },
  (accessToken, refreshToken, profile, done) => {
    // cut off everything after jpg in user image link
    const cutIndex = profile.photos[0].value.indexOf('?');
    const userImg = profile.photos[0].value.substring(0, cutIndex);
    // create new user object
    const newUser = {
      googleID: profile.id,
      username: profile.name.givenName,
      email: profile.emails[0].value,
      image: userImg
    };
    // check if user already exists
    User.findOne({
      googleID: profile.id
    }).then((user) => {
      if(user) {
        // user already exists
        done(null, user);
      } else {
        // create the user if he doesn't exist
        new User(newUser)
          .save()
          .then((user) => done(null, user));
      }
    })
  }));

  // twitter strategy
  passport.use(new TwitterStrategy({
    consumerKey: keys.twitterConsumerKey,
    consumerSecret: keys.twitterConsumerSecret,
    callbackURL: "/auth/twitter/callback"
  },
  (token, tokenSecret, profile, done) => {
    const newUser = new User ({
      twitterID: profile.id,
      username: profile.displayName,
      image: profile.photos[0].value
    }).save().then((user) => done(null, user));
  }
  ));

  // serialize
  passport.serializeUser((user_id, done) => {
    done(null, user_id);
  });

  // deserialize
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => done(null, user));
  });
}
