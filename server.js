/**
 * App 入口文件
 */
var koa = require('koa');
var _router = require('koa-router');

var app = koa();
var router = _router();
var Jade = require('koa-jade');
var port = process.env.PORT || 3000;

var index = require('./router/index');
// var freeze = require('./freeze');

var jade = new Jade({
  viewPath: './view',
  debug: true,
  app: app
});
// app.use(jade.middleware({
//   viewPath: './view'
// }));

router.get('/index', index.index);
// router.get('/freeze', freeze.index);

app.use(router.routes());

app.listen(port, function() {
  console.log('this is listening...');
});
