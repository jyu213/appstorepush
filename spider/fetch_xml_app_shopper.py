import logging
logging.basicConfig(level=logging.INFO)

'''
appshopper 站点爬虫
'''
__author__ = 'jianjian'

'''
# TODO: 细化 HTML 元素
# TODO: appid?
'''

from lxml import etree
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from pymongo import MongoClient

start_time = datetime.now()
logging.info('start time: %s', start_time)

client = MongoClient('localhost', 27017)
db = client['app_store_list_db']
collection = db['app_store_list_collection']
db_freeze = db.test

APP_SHOPPER_HOST = 'http://appshopper.com'
APP_SHOPPER_MAC_URL = 'http://appshopper.com/feed/?platform=mac&mode=featured'

tree = etree.parse(APP_SHOPPER_MAC_URL)
root = tree.getroot()

for item in root.findall('channel/item'):
    try:
        detail = item.find('description')
        detailHtml = etree.HTML(etree.tostring(detail, encoding='utf-8', method='text'))

        source = 'appshopper'
        # name = item.find('title').text
        link = item.find('link').text
        category = item.find('category').text
        current_date = datetime.now();
        today = current_date.strftime('%Y-%m-%d %H:%M:%S')
        publish_date_text = item.find('pubDate').text
        publish_date = datetime.strptime(publish_date_text.replace('EST', 'GMT'), '%a, %d %b %Y %H:%M:%S %Z').strftime('%Y-%m-%d %H:%M:%S')

        ## HTML
        icon = detailHtml.xpath(u'//img')[0].attrib['src']
        name = detailHtml.xpath(u'//h3')[0].text

        info_common_json = {
            'link': link,
            'name': name,
            'icon': icon,
            'category': category,
            'publishTime': publish_date,
            'modifyTime': today,
            'info': detail.text
        }
        info_first_json = {
            'createTime': today,
            'source': source,
            'type': 'down'
        }

        db_freeze.insert_one(dict(info_common_json, **info_first_json))
    finally:
        pass


end_time = datetime.now()
logging.info('end time: %s', end_time)

logging.info('total time: %s', (end_time - start_time).seconds)
