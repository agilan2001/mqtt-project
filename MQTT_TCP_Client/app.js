var createError = require('http-errors');
var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var app = express()

var clientRouter = require('./api/client');

var indexRouter = require('./routes/index');
var addClientRouter = require('./routes/addClient');
var messageRoomRouter = require('./routes/messageRoom');

//for QUIC landing page
var addClientRouterQUIC = require("./routes/addClientQUIC");
var messageRoomQUICRouter = require('./routes/messageRoomQUIC');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/connect', addClientRouter);
app.use('/messageRoom', messageRoomRouter);
app.use('/client', clientRouter);

//for QUIC landing page
app.use('/connectQUIC',addClientRouterQUIC);
app.use('/messageRoomQUIC',messageRoomQUICRouter);





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
