const router = require('express').Router();
const requireAuth = require('../helpers/requireAuth');
const Pin = require('../models/pin');
const User = require('../models/user');

// get welcome page
router.get('/', (req, res) => {
  if(req.isAuthenticated()) {
    res.redirect('/home');
  } else {
    Pin.find({ status: 'public' })
      .then((pins) => {
        res.render('welcome', { pins });
      });
  }
});

// get home page
router.get('/home', requireAuth, (req, res) => {
  Pin.find({ status: 'public' })
    .then((pins) => {
      res.render('home', { pins });
    });
});

// get user page
router.get('/:username', (req, res) => {
  User.findOne({ username: req.params.username })
    .then((user) => {
      Pin.find({
        status: 'public',
        author: user._id
      })
      .then((pins) => {
        res.render('user', { user, pins });
      })
    })
});


module.exports = router;
