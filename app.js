/**
 * App 入口文件
 */
'use strict'
let koa = require('koa');
let staticServer = require('koa-static');
let parse = require('co-body');
let path = require('path');
let _router = require('koa-router');
let Jade = require('koa-jade');

let app = koa();
let router = _router();
let port = process.env.PORT || 3000;

let index = require('./router/index');
// var freeze = require('./freeze');

let jade = new Jade({
  viewPath: './view',
  debug: true,
  app: app
});

app.use(staticServer(path.join(__dirname + '/static')))
router.all('/*', function *(){
  // this.body = parse(this);

    // this.body = staticServer(path.join(__dirname + '/static'))
})

router.get('/index', index.index);

// app.use(function *(){
//   yield parse.json(this);
// });

app.use(router.routes());
app.use(staticServer(path.join(__dirname + '/static')));

app.listen(port, function() {
  console.log('this is listening...');
});
