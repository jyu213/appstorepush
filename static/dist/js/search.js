/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * 搜索页面
	 */
	var search = {
	  init: function init() {
	    this.bindEvents();
	  },
	  bindEvents: function bindEvents() {
	    $('body').on('click', '.J-sub-btn', this.subForm.bind(this)).on('click', '.J-pager', this.loadPager.bind(this));
	  },

	  /**
	   * 搜索提交表单
	   */
	  subForm: function subForm(e) {
	    this.postData(1);
	  },

	  /**
	   * 翻页
	   */
	  loadPager: function loadPager(e) {
	    var et = $(e.currentTarget),
	        idx = et.data('idx') * 1,
	        total = et.data('total') * 1;

	    if (idx >= total) {
	      return false;
	    }

	    this.postData(idx + 1);
	  },
	  postData: function postData() {
	    var idx = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

	    var _self = this;

	    var term = $('.J-sub-ipt').val(),
	        country = $('.J-sub-country').val();
	    var el = $('.J-result-list');

	    if (term !== '' && country !== '') {
	      $.ajax({
	        url: '/search',
	        data: {
	          term: term,
	          country: country,
	          page: idx
	        }
	      }).done(function (data) {
	        if (data.success) {
	          var items = data.items,
	              pager = data.pager,
	              html = _self.listTpl(items);
	          // console.log(data.items);
	          el.html(html);
	          $('#pager').html(_self.listPager(pager.currentPage, pager.totalPage));
	        } else {
	          el.html('');
	          el.find('#pager').html('');
	          console.log(data.message);
	        }
	      });
	    } else {
	      alert('不能为空');
	    }
	  },
	  listTpl: function listTpl(data) {
	    var html = '',
	        tpl = function tpl(item) {
	      return '<div class="media">\n                          <div class="media-left">\n                            <img class="media-object" src="' + item.artworkUrl100 + '" />\n                          </div>\n                          <div class="media-body">\n                            <a class="media-heading" href="' + item.trackViewUrl + '">' + item.trackName + '</a>\n                            <p> 设备支持：' + item.supportedDevices + '</p>\n                            <p> ID：' + item.artistId + '</p>\n                            <p> 版本：' + item.version + '</p>\n                            <pre style="display: none;">' + item.description + '</pre>\n                          </div>';
	    };

	    data.forEach(function (item) {
	      html += tpl(item);
	    });
	    return html;
	  },
	  listPager: function listPager(idx, total) {
	    var pager = '<li><a href="javascript:;" class="J-pager" data-idx="' + idx + '" data-total="' + total + '">上一页</a></li>\n                  <li class="active"><a>' + idx + '/' + total + '</a></li>\n                  <li><a href="javascript:;" class="J-pager" data-idx="' + idx + '" data-total="' + total + '">下一页</a></li>';

	    return pager;
	  }
	};

	search.init();

/***/ }
/******/ ]);