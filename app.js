var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user')

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev', {
//   stream: process.stdout //标准输出 默认
// }));

const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  //开发测试环境
  app.use(logger('dev', {
    stream: process.stdout //标准输出 默认
  }));
} else {
  //线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream //标准输出 默认
  }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
app.use(session({
  secret: 'WJiol#23123_',
  cookie: {
    path: '/', //密钥
    httpOnly: true, //前端不能更改
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
