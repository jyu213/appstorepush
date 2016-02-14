/**
 * 降价列表展示
 */
'use strict';

// let mongo = require('koa-mongo');
let MongoClient = require('mongodb').MongoClient;

const DB_URL = 'mongodb://localhost:27017/app_store_list_db';
// 每页条数
const LIMIT = 20;
// 搜索条件
const SEARCH_QUE = [['modifyTime', -1], ['publishTime', -1], ['appid', 1]];

/**
 * 普通页面信息抓取结果展示
 */
exports.list_page = function *() {
    let _self = this;

    // 页码
    let idx = parseInt(this.params.page, 10) || 1;

    let db = yield MongoClient.connect(DB_URL);
    let collection = db.collection('freeze');
    // @TODO: 未做翻页性能处理
    // let result = yield collection.find().sort([['modifyTime', -1], ['publishTime', -1], ['appid', 1]]).toArray();
    let list = yield collection.find().sort(SEARCH_QUE)
                                .skip((idx - 1) * LIMIT).limit(LIMIT).toArray();
    let total = yield collection.find().sort(SEARCH_QUE).count();
    let items = [];

    this.render('drop', {items: list, limit: LIMIT, currentPager: idx, totalPager: Math.ceil(total / LIMIT)}, true);
    db.close();
};

/*
 * RSS 订阅信息展示
 */
exports.list_rss = function *() {

};