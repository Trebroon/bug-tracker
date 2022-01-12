if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const helmet = require('helmet');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');
//express error middleware
const ExpressError = require('./utils/ExpressError.js');
// serving favicon icon 
const favicon = require('serve-favicon');
// passport 
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user');

// site routes 
const projectsRoutes = require('./routes/projects.js');
const projectRoutes = require('./routes/project');
const usersTicketsRoutes = require('./routes/usersTickets');
const userRoutes = require('./routes/users.js');

const MongoStore = require('connect-mongo');

// Database connection
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/bug-tracker';
// Connecting to DB
mongoose.connect(dbUrl).
  catch(error => handleError(error));// DB connetion error handling

const db = mongoose.connection // DB after connetion error handling 
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
  console.log('Database Connected');
})

// express init
const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const secret = process.env.SECRET || 'thisshouldbebettersecret';

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});

store.on('error', function(e){
  console.log('SESSION STORE ERROR', e);
})

// session configuration
const sessionConfig = {
  store,
  name: 'sess',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

// hemlet init and setup
app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://kit.fontawesome.com/",
  "https://cdn.jsdelivr.net",
];

const styleSrcUrls = [
  "https://fonts.googleapis.com/",
  "https://cdn.jsdelivr.net",
];

const connectSrcUrls = [
  "https://ka-f.fontawesome.com",
  "https://use.fontawesome.com/"
];

const fontSrcUrls = [
  "https://ka-f.fontawesome.com",
  "https://fonts.gstatic.com"
];

app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: ["'self'", "https://ka-f.fontawesome.com",],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);

//passport initialization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

//favicon 
app.use(favicon(path.join(__dirname, 'public', 'images', 'ico', 'favicon.ico')));
//images
app.use(express.static('public'));

//routes
app.use('/usersTickets', usersTicketsRoutes);
app.use('/users', userRoutes);
app.use('/project', projectRoutes);
app.use('/', projectsRoutes);

// Error handler for unknown url
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
});
// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No Something Went Wrong!';
  res.status(statusCode).render('error', { err });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});