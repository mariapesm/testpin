const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const methodOverride = require('method-override');
const { section, editOrDelete, formatDate, deleteComment } = require('./helpers/handlebars');
const keys = require('./config/keys');

// database connection
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true })
  .then(() => console.log('Connection to MongoDB successful'))
  .catch((err) => console.log(`Unable to connect to MongoDB: ${err}`));

// import models
const Pin = require('./models/pin');
const User = require('./models/user');

// initialize the express application
const app = express();

// import routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const pinRoutes = require('./routes/pin');

// method override
app.use(methodOverride('_method'));

// view engine setup
app.engine('handlebars', exphbs({
  defaultLayout: 'master',
  helpers: { section, editOrDelete, formatDate, deleteComment }
}));
app.set('view engine', 'handlebars');

// serve favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))

// static files
app.use(express.static(path.join(__dirname, 'public')));

// body parser & express validator
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

// sessions
app.use(session({
  secret: keys.sessionSecret,
  resave: true,
  saveUninitialized: true
}));

// flash messages
app.use(flash());

// passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.loggedUser = req.user || null;
  next();
});

// routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/pin', pinRoutes);

// handle 404
app.use((req, res) => {
  res.status(404);
  res.render('error', { title: '404: Page Not Found' });
});

// start the server
const PORT = process.env.PORT || 4444;
app.listen(PORT, () => console.log(`Application running on port ${ PORT }`));
