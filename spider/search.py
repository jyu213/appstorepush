import logging
logging.basicConfig(level=logging.INFO)

from urllib import request, parse
import json
from pymongo import MongoClient
from datetime import datetime

client = MongoClient('localhost', 27017)
db = client['app_store_list_db']
collection = db['app_store_list_collection']
wishs = db.wishs

list_file = open('./data/wish_app_list.json', 'r', encoding="utf-8")
list = json.loads(list_file.read())
ids = list['data']
# print(ids)

BASIC_URL = 'https://itunes.apple.com/lookup'
today = datetime.today();
for item in ids:
    with request.urlopen(BASIC_URL + '?id=' + item['id']) as f:
        data = f.read()
        try:
            obj = json.JSONDecoder().decode(data.decode('utf-8'))['results'][0]
            id = obj.get('artistId', 0)
            exist_appid = wishs.find_one({'appid': id})
            info_json = {
                'appid': id,
                'price': obj.get('price', ''),
                'createTime': today,
                'modifyTime': today
                # 'info': obj
            }

            # TODO: search exsit
            # wishs.insert_one(info_json)
            if exist_appid:
                wishs.find_one_and_update({'appid': id}, {'$set': {
                    'price': obj.get('price', ''),
                    'modifyTime': today
                }})
            else:
              wishs.insert_one(info_json)
        finally:
            pass


