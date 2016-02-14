import logging
logging.basicConfig(level=logging.INFO)

'''
appshopper 站点爬虫
'''
__author__ = 'jianjian'

# TODO: appid 过期时效点
# TODO: 价格波动

import re
import time
import json
from urllib import request, parse
from bs4 import BeautifulSoup
from datetime import datetime, timedelta

from pymongo import MongoClient

start_time = datetime.now()
logging.info('start time: %s', start_time)

client = MongoClient('localhost', 27017)
db = client['app_store_list_db']
collection = db['app_store_list_collection']
db_freeze = db.freeze

APP_SHOPPER_HOST = 'http://appshopper.com'
APP_SHOPPER_MAC_URL = 'http://appshopper.com/mac/all/prices/'
APP_SHOPPER_IOS_URL = 'http://appshopper.com/all/prices/'
# 爬取起始页面
app_shopper_idx = 1
# 是否翻页标记位
# app_shopper_flag = True

def fetchData(idx = 1, url = APP_SHOPPER_MAC_URL):
    current_url = url + str(idx)
    html = request.urlopen(current_url)
    soup = BeautifulSoup(html, 'html.parser')
    listContent = soup.find_all(class_='section app')

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
            publish_date_text = item.find(class_='last-updated').string
            current_date = datetime.now();
            today = current_date.strftime('%Y-%m-%d %H:%M:%S')

            # 实际天数转化, 1 days ago| 12 hours ago
            publish_list = re.split('\s', publish_date_text)
            publish_time_type = publish_list[1]
            publish_time = int(publish_list[0])
            if re.match('minute', publish_time_type):
                publish_date = current_date + timedelta(minutes=-publish_time)
            elif re.match('hour', publish_time_type):
                publish_date = current_date + timedelta(hours=-publish_time)
            elif re.match('day', publish_time_type):
                publish_date = current_date + timedelta(days=-publish_time)
            else:
                pass

            # 设置简单过期规则
            if publish_date_text == '2 days ago':
                app_shopper_flag = False
            else:
                app_shopper_flag = True

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
                'publishTime': publish_date.strftime("%Y-%m-%d %H:%M:%S"),
                'modifyTime': today
            }
            info_first_json = {
                'appid': appid,
                'createTime': today,
                'source': source,
                'type': 'drop'
            }

            if exist_appid:
                db_freeze.find_one_and_update({'appid': appid}, {'$set': info_common_json})
            else:
                db_freeze.insert_one(dict(info_common_json, **info_first_json))
        finally:
            pass

    if app_shopper_flag:
        fetchData(idx + 1)

fetchData(app_shopper_idx, APP_SHOPPER_MAC_URL)
fetchData(app_shopper_idx, APP_SHOPPER_IOS_URL)

end_time = datetime.now()
logging.info('end time: %s', end_time)

logging.info('total time: %s', (end_time - start_time).seconds)
