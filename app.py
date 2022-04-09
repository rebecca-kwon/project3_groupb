from flask import Flask, render_template, jsonify
from flask_pymongo import PyMongo
import json_data


# Create an instance of Flask
app = Flask(__name__)



@app.route("/")
def home():

    # Return template 
    return render_template("index.html")


@app.route("/data")
def data():

    data2=json_data.jsondata()

    return jsonify(results=data2)





if __name__ == "__main__":
    app.run(debug=True)
