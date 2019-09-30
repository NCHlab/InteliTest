# from flask import Flask
from flask_api import FlaskAPI, status, exceptions
from flask_cors import CORS
from pymongo import MongoClient
from bson import json_util
import json

client = MongoClient('localhost', 27017)
# client = MongoClient('mongodb://localhost:27017/')
db = client.intelistyle
collection = db.products


app = FlaskAPI(__name__)
CORS(app)

@app.route("/", methods=['GET', 'POST'])
def homepage():

    return {'default example API':'http://localhost:5000/api',
            'API by Page':'http://localhost:5000/api/{pageNumber}',
            'API by Search':'http://localhost:5000/api/search/{search word}',}


@app.route("/api/", methods=['GET'])
def products_list():

    return json.loads(json_util.dumps(collection.find().limit(4)))



@app.route("/api/<page>", methods=['GET'])
def products_list_by_page(page):
    
    # For each page Number, Limits the number of results to 10
    # e.g Page is 3, lowerlimit = 20, upper limit = 30 => displays results 20 to 29 (10 results)
    lowerlimit = (int(page)*10)-10
    uppperlimit = int(page)*10
    
    return json.loads(json_util.dumps(collection.find()[lowerlimit:uppperlimit]))



@app.route("/api/search/<item>", methods=['GET'])
def products_search(item):
    
    # Search for type of item, anything found in product title e.g dress
    return json.loads(json_util.dumps(collection.find({"product_title": {'$regex': f'{item}', '$options': 'i'}})))



if __name__ == "__main__":
    app.run(debug=True)