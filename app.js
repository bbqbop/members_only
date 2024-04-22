require('dotenv').config()

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Setup session middleware with MongoStore
app.use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: true,
    store: MongoStore.create({client: mongoose.connection.client, collection: "sessions"}),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // equals 1 day!
    }
  }));

require("./config/passport");

app.use(passport.initialize())
app.use(passport.session());


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next()
})



app.use('/', indexRouter);



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

module.exports = app;
