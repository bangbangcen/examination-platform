const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('express-async-errors');

const { ipIntercept, limiter } = require('./ip-intercept');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const relationshipRouter = require('./routes/relationship');
const packageRouter = require('./routes/package');
const adminRouter = require('./routes/admin');
const assignment = require('./routes/assignment');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(ipIntercept); // 拦截黑名单内的ip，防止ddos攻击
app.use(limiter); //访问频率限制
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/relationship', relationshipRouter);
app.use('/package', packageRouter)
app.use('/admin', adminRouter);
app.use('/assignment', assignment);

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
  console.log(err)
  // res.render('error');
  res.send(err);
});

module.exports = app;
