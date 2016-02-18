import logging
logging.basicConfig(level=logging.INFO)

'''
apple store rss
view: http://www.apple.com/rss/
'''

__author__ = 'jianjian'

from lxml import etree
# from bs4 import BeautifulSoup
from multiprocessing import Pool
from datetime import datetime
from pymongo import MongoClient

start_time = datetime.now()
logging.info('fetch_apple_top_rss.py / start time: %s', start_time)

APPLE_TOP_BASIC = 'http://itunes.apple.com/cn/rss/'
APPLE_TOP_LIST_URL = ['toppaidmacapps',
                    'topfreemacapps',
                    # 'topmacapps',
                    # 'topgrossingmacapps',
                    'toppaidipadapplications',
                    'topfreeapplications',
                    'topfreeipadapplications',
                    'toppaidapplications',
                    'newapplications',
                    'newpaidapplications',
                    'newfreeapplications',
                    'topgrossingapplications',
                    'topgrossingipadapplications']

# namespace change
def nsAttrib(key, ns):
    return '{' + ns + '}' + key

def fetchData(url):
    client = MongoClient('localhost', 27017)
    db = client['app_store_list_db']
    collection = db['app_store_list_collection']
    # db_table = db.top_rss
    db_table = db.top_rss_test

    URL = APPLE_TOP_BASIC + url + '/limit=50/xml'
    ns = {
        'real': 'http://www.w3.org/2005/Atom',
        'role': 'http://itunes.apple.com/rss'
    }

    tree = etree.parse(URL)
    root = tree.getroot()

    for item in root.findall('real:entry', ns):
        try:
            current_date = datetime.now();
            today = current_date.strftime('%Y-%m-%d %H:%M:%S')

            source = 'itunes'
            appid = item.find('real:id', ns).attrib[nsAttrib('id', ns['role'])]
            name = item.find('role:name', ns).text
            link = item.find('real:link', ns).attrib['href']
            description = '' if item.find('real:summary', ns) is None else item.find('real:summary', ns).text
            category = item.find('real:category', ns).attrib['label']
            price = item.find('role:price', ns).text
            icon = item.find('role:image[@height="100"]', ns).text
            info = item.find('real:content', ns).text
            publish_date_text = item.find('real:updated', ns).text
            publish_date = datetime.strptime(publish_date_text[0:19], '%Y-%m-%dT%H:%M:%S').strftime('%Y-%m-%d %H:%M:%S')

            exist_appid = db_table.find_one({'appid': appid})
            info_common_json = {
                'link': link,
                'name': name,
                'icon': icon,
                'description': description,
                'price': price,
                'category': category,
                'publishTime': publish_date,
                'modifyTime': today,
                'info': info
            }
            info_first_json = {
                'appid': appid,
                'createTime': today,
                'source': source,
                'type': 'top'
            }

            if exist_appid:
                db_table.find_one_and_update({'appid': appid}, {'$set': info_common_json})
            else:
                db_table.insert_one(dict(info_common_json, **info_first_json))
        except:
            print('except')
            pass
        finally:
            pass

# TODO: 多进程处理; now is 57s
# TODO: 抓取内容分类
p = Pool(8)
# for url in APPLE_TOP_LIST_URL:
#     p.apply_async(fetchData(url), args(url,))
p.map_async(fetchData, APPLE_TOP_LIST_URL)
p.close()
p.join()



end_time = datetime.now()
logging.info('end time: %s', end_time)
logging.info('total time: %s', (end_time - start_time).seconds)
