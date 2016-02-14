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
let search = require('./api/search');
let drop = require('./router/drop');

let jade = new Jade({
    viewPath: './view',
    debug: true,
    app: app
});

router.get('/index', index.index);
router.get('/search', search.index);
// 降价
router.get('/drop', drop.list_page);
router.get('/drop/:page', drop.list_page);
router.get('/drop2', drop.list_rss);

app.use(router.routes());
app.use(staticServer(path.join(__dirname + '/static')));

app.listen(port, function() {
    console.log('this is listening...');
});
