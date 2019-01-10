const router = require('express').Router();
const { check, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const passport = require('passport');

// google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// google callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/'
}), (req, res) => {
  // Authentication successful
  req.flash('success_msg', 'Welcome to Pinterest Clone!');
  res.redirect('/home');
});

// twitter
router.get('/twitter', passport.authenticate('twitter'));

// twitter callback
router.get('/twitter/callback', passport.authenticate('twitter', {
  failureRedirect: '/'
}), (req, res) => {
  // Authentication successful
  req.flash('success_msg', 'Welcome to Pinterest Clone!');
  res.redirect('/home');
});


// signup
router.post('/signup', [
    // validate form values
    check('username').isLength({ min: 4, max: 20 }).withMessage('Username must be between 4-20 characters long.'),
    check('email').isEmail().withMessage('The email you entered is invalid, please try again.'),
    check('email').isLength({ min: 4, max: 100 }).withMessage('Email address must be between 4-100 characters long, please try again.'),
    check('password', 'Password must be at least 8 characters long and contain one number').isLength({ min: 8 }).matches(/\d/),
    check('password2', 'Passwords do not match, please try again.').exists().custom((value, { req }) => value === req.body.password)
  ],
  (req, res, next) => {
    // check for validation errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      // return errors to the user
      return res.status(422).json({ errors: errors.mapped() });
    } else {
      // extract form values
      const username = req.body.username;
      const email = req.body.email;
      const password = req.body.password;
      // check if user already exists
      User.findOne({ email })
        .then((user) => {
          if(user) {
            // return error if user exists
            req.flash('error_msg', 'User with this information already exists');
            res.redirect('/');
          } else {
            // hash the password and save the user in the database
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(password, salt, (err, hash) => {
                if(err) {
                  next(err);
                }
                // create new user object and save in the database
                const user = new User({
                  username,
                  email,
                  password: hash
                });
                user.save((err) => {
                  if(err) {
                    return next(err);
                  }
                  req.flash('success_msg', 'Registration successful, you can now log in!');
                  res.redirect('/');
                });
              });
            });
          }
        });
    }
});


// login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    // if invalid username or password
    if (!user) {
      req.flash('error_msg', 'Invalid username or password.');
      return res.redirect('/');
    }

    // log the user in
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/home');
    });
  })(req, res, next);
});

// logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Thanks for stopping by!');
  res.redirect('/');
});


module.exports = router;
