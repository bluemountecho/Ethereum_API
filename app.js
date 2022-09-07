var createError = require('http-errors');
var express = require('express');
var path = require('path');
var http = require('http');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const basicAuth = require('express-basic-auth')
var cors = require('cors')

var ethRouter = require('./routes/ethRoutes');
var app = express();

app.use(cors())
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

app.use(basicAuth({
  users: { 'vdfhg4y4g(#%*g': 'U#GT*Gy98TH89y87gS4*(#TG*EG8&(*#YTGEH' },
  challenge: true,
  realm: 'foo',
}))

app.use('/:network', function (req, res, next) {
  req.network = req.params.network
  next();
}, ethRouter);

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