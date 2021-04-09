var createError = require('http-errors');
var express = require('express');
const expressListRoutes = require('express-list-routes');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const cors = require('cors')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoDBSession = require('connect-mongodb-session')(session)


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var mailRouter = require('./routes/mail');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({origin : process.env.URLCORS , credentials : true}))
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.URLMONGO , {
  useNewUrlParser : true,
  useCreateIndex : true,
  useUnifiedTopology : true
}).then(res =>console.log('je suis connecter avec mongo'))

const store = new MongoDBSession({
  uri : process.env.URLMONGO,
  collection : 'mySession'
})

app.use(session({
  secret : process.env.SECRETSESSION,
  resave : false,
  saveUninitialized : false,
  cookie : {
      maxAge : 30 * 60000,
      httpOnly: false,
  },
  store : store
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/mail', mailRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


expressListRoutes(app, { prefix: '' });
module.exports = app;
