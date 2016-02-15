/**
 * itunes Top 列表展示
 */
'use strict';

let MongoClient = require('mongodb').MongoClient;

const DB_URL = 'mongodb://localhost:27017/app_store_list_db';
// 每页条数
const LIMIT = 20;

/**
 * itunes RSS list page
 */
exports.list = function *() {
    // 页码
    let idx = parseInt(this.params.page, 10) || 1;
    // 搜索条件
    const SEARCH_PAGE_QUEUE = [['modifyTime', -1], ['publishTime', -1], ['appid', 1]];

    let db = yield MongoClient.connect(DB_URL);
    let collection = db.collection('top_rss');
    // @TODO: 未做翻页性能处理
    let list = yield collection.find().sort(SEARCH_PAGE_QUEUE)
                                .skip((idx - 1) * LIMIT).limit(LIMIT).toArray();
    let total = yield collection.find().sort(SEARCH_PAGE_QUEUE).count();
    let items = [];

    this.render('top_page', {items: list, limit: LIMIT, currentPager: idx, totalPager: Math.ceil(total / LIMIT)}, true);
    db.close();
};
