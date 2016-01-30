import logging

from urllib import request, parse
import json
from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client['app_store_list_db']
collection = db['app_store_list_collection']
wishs = db.wishs

list_file = open('./data/wish_app_list.json', 'r', encoding="utf-8")
list = json.loads(list_file.read())
ids = list['data']
# print(ids)

# post_id = posts.insert_one(list).inserted_id
# print(post_id)
# db.collection_names(include_system_collections=False)

BASIC_URL = 'https://itunes.apple.com/lookup'
# ID = '379561506'
for item in ids:
    with request.urlopen(BASIC_URL + '?id=' + item['id']) as f:
        data = f.read()
        obj = json.JSONDecoder().decode(data.decode('utf-8'))['results'][0]
        # print(obj)
        try:
            info_json = {
                'appid': obj.get('artistId', 0),
                'price': obj.get('price', ''),
                'info': obj
            }
            # TODO: search exsit
            wishs.insert_one(info_json)
        finally:
            pass

print(wishs.count())
