/**
 * 限免推送 API
 */
'use strict';
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
// var appList = ['Day+one'];

// 搜索配置项
// var searchConfig = {
//   term: appList.join(''),
//   media: 'software',
//   limit: 1
// };

const DEF_SEARCH_CONFIG = {
  limit: 50, // default
  media: 'software'
};
// app store 搜索接口
const BASIC_URL = 'https://itunes.apple.com/search?';
// 缓存存储长度
const MAX_CACHE_LENGTH = 1000;

// 简易搜索缓存，未做过期处理，简单判定 1000 上限清空
var resultCache = {};

/**
 * 搜索接口
 * @param {String} term, 应用名称
 * @param {String} country, 地区
 * @param {Number} page, 页码
 * @param {Number} per, 每页个数
 */
exports.index = function *() {
  let query = this.request.query;
  let term = query.term || '';
  let country = query.country || 'cn';
  let page = query.page || 1;
  let per = query.per || 10;

  console.log(term, country);
  let searchConfig = Object.assign({}, DEF_SEARCH_CONFIG, {
      // @TODO: URL-encoded 转换规则
      term: term.replace(/[\s+|(%2B)+]/, '+'),
      country: country
  });
  console.log(searchConfig)
  let requestURL = BASIC_URL + parseURL(searchConfig);
  console.log(requestURL, 'request url');

  if (Object.keys(resultCache).length > MAX_CACHE_LENGTH) {
    resultCache = {};
  }
  let items;
  if (resultCache[term]) {
    items = resultCache[term];
  } else {
    let result = yield request(requestURL);
    if (result.body.match(/^(\s)*\{/g)) {
      items = JSON.parse(result.body).results || [];
      resultCache[term] = items;
    } else {
      this.body = {
        success: false,
        items: [],
        message: result.body
      };
      return false;
    }
  }

  let totalPage = Math.ceil(items.length / per),
      len = items.length;
  if (page > totalPage) {
    page = totalPage;
  }
  let start = (page - 1) * per,
      end = page * per > len ? len - 1 : (page * per) - 1;
  this.body = {
    success: true,
    items: items.slice(start, end),
    pager: {
      total: len,
      totalPage: totalPage,
      currentPage: page
    },
    message: 'success'
  };




  // @TODO: 自己拼装 页码
//   var body = result.body;
//   var data = JSON.parse(body);
//   this.render('index', data, true);

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
