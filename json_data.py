import pandas as pd
import pymongo


# Setup connection to mongodb
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

# Select database and collection to use
db = client.michelin_app

data = pd.read_csv('Michelin_Source/Michelin_Data_Final.csv')

jsoned=pd.DataFrame(data).dropna().to_dict('records')

db.collection.insert_many(jsoned)


def jsondata():
    cursor = db.collection.find({})

    data1=[]


    for item in cursor: 
        data1.append({
            'name':item['name'],
            'michelin_award':item['michelin_award'],
            'city':item['city'],
            'country':item['country'],
            'lat':item['lat'],
            'lon':item['lon'],
            'image':item['image'],
            'cuisine1':item['cuisine1'],
            'url':item['url'],
            'Hotel_Name':item['Hotel_Name'],
            'h_lat':item['h_lat'],
            'h_lon':item['h_lon']
        })


    return data1

