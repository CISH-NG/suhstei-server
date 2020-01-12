let express = require('express'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  passport = require('passport'),
  dbConfig = require('./database/db');

// [SH] Bring in the Passport config after model is defined
require('./config/passport');

// Routes to Handle Request
const userRoute = require('./routes/user.route')


// MongoDB Setup
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
  useNewUrlParser: true
}).then(() => {
    console.log('Database sucessfully connected')
  },
  error => {
    console.log('Database could not be connected: ' + error)
  }
)


// Setup Express.js
const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(cors());

// [SH] Initialise Passport before using the route middleware
app.use(passport.initialize());

// Make "public" Folder Publicly Available
app.use('/public', express.static('public'));


// API Route
app.use('/api', userRoute)


// Error favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204));


const port = process.env.PORT || 8808;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})


// Error
app.use((req, res, next) => {
  // Error goes via `next()` method
  setImmediate(() => {
    next(new Error('Something went wrong'));
  });
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// [SH] Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({
      "message": err.name + ": " + err.message
    });
  }
});