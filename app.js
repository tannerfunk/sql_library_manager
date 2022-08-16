var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const book = require('./models/book');

var app = express();

// app.use((req, res, next) => {
//   const err = new Error("SHOOOOT");
//   err.status = 500;
//   next(err);
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// this is the require method that imports the instance of sequelize that was instantiated in models/index.js when I used sequelize CLI
const sequelize = require('./models').sequelize; 

//the keyword async defines an asynchronous function
(async () => {

  //calling .sync() on your model turns that MODEL from javascript to a TABLE in the database
  await sequelize.sync(); 
  //try -> what needs to be executed, catch -> the exceptions
  try {
    //inside an async function we need to AWAIT for the function to return a promise
    
    // // TESTING THE CONNECTION
    await sequelize.authenticate();
    console.log('Connection to the database successful!');


  } catch (error) {
    console.log('Error connecting to the database: ', error);
  }
}) ();


app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  // err.message = "We've looked EVERYWHERE... but we can't find the page you want.. we're sorry!";
  // next (err);
  // or use res.render to render a page and pass IT the INFOOOOOO
  res.render('page-not-found', err)
});

app.use((err, req, res, next) => {
  if (err.status != 404) {
    res.locals.error = err;
    err.message = "Sorry! There was an unexpected error on the server.";
    res.status(err.status);
    res.render('error', err);
  }
  });


//this is from using-sequelize-orm-with-express
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
