var koa = require('koa');
var app = koa();

app.use(function *(next){
  console.log('a');
  yield next;
  console.log('b');
  this.body = 'hello';
});

app.use(function *(next){
  console.log('c');
  yield next;
  console.log('d');
});

app.use(function *(){
  console.log('e');
})

app.listen(3000);
