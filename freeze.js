/**
 * 限免推送
 */
// var koa = require('koa');
// var app = koa();
// var https = require('https');

var request = require("co-request");

/**
 * @Search API: http://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html
 */

/**
 * URL 组装
 */
function parseURL(params) {
  var props = Object.keys(params);
  var url = '';

  props.forEach(function(item, i) {
    url += item + '=' + encodeURIComponent(params[item]) + (i >= props.length - 1 ? '' : '&');
  });
  return url;
}

// App 列表
var appList = ['Day+one'];

// 搜索配置项
var searchConfig = {
  term: appList.join(''),
  media: 'software',
  limit: 1
};
var basicURL = 'https://itunes.apple.com/search?';
var requestURL = basicURL + parseURL(searchConfig);

exports.index = function *() {
  var result = yield request(requestURL);
  var body = result.body;

  // this.body = JSON.stringify(body);

  this.render('index', body);
  // https.get(requestURL, function(data) {
  //   data.setEncoding('utf-8');
  //   var resData = [];

  //   data.on('data', function(chunk) {
  //     resData.push(chunk);
  //   }).on('end', function() {
  //     this.body = JSON.stringify(resData);
  //   }).on('error', function(err) {
  //     console.log(err);
  //   });
  // });

};
