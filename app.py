from flask import Flask, render_template, redirect, jsonify, Response
from flask_pymongo import PyMongo
import pandas as pd
import json
import json_data


# Create an instance of Flask
app = Flask(__name__)



@app.route("/")
def home():

    # Return template and data
    return render_template("webpage/index.html")


@app.route("/data")
def data():

    data2=json_data.jsondata()

    return jsonify(results=data2[0:len(data2)])





if __name__ == "__main__":
    app.run(debug=True)
