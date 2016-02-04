import logging
logging.basicConfig(level=logging.INFO)

'''
appshopper 站点爬虫
'''
__author__ = 'jianjian'

# TODO: 翻页
# TODO: 设置抓取时间临界点
# TODO: appid 过期时效点
# TODO: 价格波动

import time
import json
from urllib import request, parse
from bs4 import BeautifulSoup
from datetime import datetime

from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client['app_store_list_db']
collection = db['app_store_list_collection']
db_freeze = db.freeze

APP_SHOPPER_HOST = 'http://appshopper.com'
APP_SHOPPER_URL = 'http://appshopper.com/mac/all/prices/'

logging.info('start time')
start_time = datetime.now()
logging.info(start_time)

html = request.urlopen(APP_SHOPPER_URL)
soup = BeautifulSoup(html, 'html.parser')

# print(soup.prettify())
listContent = soup.find_all(class_='section app')
# ids = listContent[0]
# print(ids)

# print(len(listContent))
for item in listContent:
    try:
        attrs = item.attrs
        details = item.find(class_='details')

        appid = attrs['data-appid']
        link = APP_SHOPPER_HOST + item.find('a').attrs['href']
        name = item.find(class_='dark-links').string
        icon = item.find(class_='icon').find('img').attrs['src']
        rate = item.find(class_='stars').attrs['data-rating']
        system = details.find('nobr').string
        category = details.find(class_='category').string
        description = details.find(class_='description').string
        price = item.find(class_='price').contents[0]
        source = 'appshopper'
        today = datetime.today();

        exist_appid = db_freeze.find_one({'appid': appid})
        info_common_json = {
            'link': link,
            'name': name,
            'icon': icon,
            'rate': rate,
            'system': system,
            'category': category,
            'description': description,
            'price': price,
            'modifyTime': today
        }
        info_first_json = {
            'appid': appid,
            'createTime': today,
            'source': source
        }

        if exist_appid:
            db_freeze.find_one_and_update({'appid': appid}, {'$set': info_common_json})
        else:
          db_freeze.insert_one(dict(info_common_json, **info_first_json))
    finally:
        pass

end_time = datetime.now()
logging.info(end_time)
logging.info('end time')

logging.info('total time: %s', (end_time - start_time).seconds)
