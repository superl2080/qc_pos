const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const main = require('./app/main');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in app/dist
app.use(favicon(path.join(__dirname, 'app/dist', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.raw({ type: 'text/xml' }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app/dist')));

main.run(app);


// error handler
app.use((err, req, res, next) => {
  // catch 404 and forward to error handler
  let error = err;
  if (!error) {
    error = new Error('Not Found');
    error.status = 404;
  }

  error.status = error.status || 500;
  console.error(error);
  if (res.headersSent) {
    return next(error);
  }
  res.render('error', { error });
});

module.exports = app;
