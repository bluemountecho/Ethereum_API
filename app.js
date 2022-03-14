var createError = require('http-errors');
var express = require('express');
var path = require('path');
var http = require('http');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const basicAuth = require('express-basic-auth')

var ethRouter = require('./routes/ethRoutes');
var bscRouter = require('./routes/bscRoutes');
var testRouter = require('./routes/crnRoutes')

var app = express();

app.use(basicAuth({
  users: { 'user': 'pass' },
  challenge: true,
  realm: 'foo',
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/eth', ethRouter);
app.use('/bsc', bscRouter);
app.use('/crn', basicAuth({
  users: { 'test': 'test' },
  challenge: true,
  realm: 'foo1',
}),  testRouter);

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

var httpServer = http.createServer(app);

httpServer.listen(8888, () => {
  console.log('Server started at http://localhost:8888')
});