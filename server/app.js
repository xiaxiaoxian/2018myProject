let express = require('express');
let path = require('path');
let favicon = require('serve-favicon'); // 浏览器上面显示的icon
let logger = require('morgan');
let cookieParser = require('cookie-parser'); // 获取cookie信息进行转换
let bodyParser = require('body-parser');
let ejs = require('ejs'); // 引入模块

let index = require('./routes/index'); // 加载路由
let users = require('./routes/users');
let goods = require('./routes/goods');

let app = express(); // 启动服务

// view engine setup
// app.set('views', path.join(__dirname, 'views')); // 设置显示文件位置
// app.set('view engine', 'jade'); // 设置jade引擎

// 设置html引擎
app.set('views',path.join(__dirname,'views'));
app.engine('.html',ejs.__express);
app.set('view engine','html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // 设置静态资源路径

app.use(function(req,res,next){ // 使用全局拦截器：防止用户未登录可以操作页面底层功能
  if(req.cookies.userId){
    next();
  }else{
    if(req.originalUrl == '/users/login' || req.originalUrl == 'users/logout' || req.path == '/goods/list'){ // 方法二:req.originalUrl.indexOf(/goods/list)>-1;
      next();
    }else{
      res.json({
        status:'10001',
        msg:'当前未登录',
        result:''
      });
    }
  }

});

app.use('/', index); // 当访问/ 就加载index文件
app.use('/users', users);
app.use('/goods', goods);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
