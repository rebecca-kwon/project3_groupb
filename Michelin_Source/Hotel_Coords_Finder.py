# Hotel Coords Finder

#### Note
#Keep an eye on your API usage. Use https://developers.google.com/maps/reporting/gmp-reporting as reference for how to monitor your usage and billing.

#Dependencies and Setup
import pandas as pd
import requests
import json
import time

#Import API key
from api_keys import g_key

### Load the restaurants csv

#import the csv
Restaurants = pd.read_csv('michelin_clean.csv')
restaurants_df = pd.DataFrame(Restaurants)

# ### Hotel Map
# Store into variable named `hotel_df`.
# Add a "Hotel Name" column to the DataFrame.
# Set parameters to search for 5 star hotels with 7000 meters.
# Hit the Google Places API for each Hotel's coords
# Store the first Hotel result into the DataFrame.


#make a new dataframe with an empty column for the hotels
hotel_df = restaurants_df
hotel_df['Hotel_Name'] = ""
hotel_df['h_lat'] = ""
hotel_df['h_lon'] = ""

 # update params key value
params = {
"query":'5-Star Hotel',
"radius": 7000,
"type": 'Hotel',
"key": g_key
}

# Loop through the cities_pd and run a lat/long search for each city
for index, row in restaurants_df.iterrows():
    time.sleep(.011)
    # get lat, lng from df
    lat = row['lat']
    lng = row['lon']
    
    # change location each iteration while leaving original params in place
    params["location"] = f"{lat},{lng}"
    base_url = "https://maps.googleapis.com/maps/api/place/textsearch/json"

    # make request
    hotel_data = requests.get(base_url,params=params)
    
    # convert to json
    hotel_data = hotel_data.json()

    try:
        hotel_df.loc[index, 'Hotel_Name'] = hotel_data["results"][1]["name"]
        hotel_df.loc[index, 'h_lat'] = hotel_data["results"][1]["geometry"]["location"]["lat"]
        hotel_df.loc[index, 'h_lon'] = hotel_data["results"][1]["geometry"]["location"]["lng"]
        print("Swanky Place Found! Adding Coordinates")
        
    except (KeyError, IndexError):
        hotel_df.loc[index, 'Hotel_Name'] = "NULL"
        hotel_df.loc[index, 'h_lat'] = "NULL"
        hotel_df.loc[index, 'h_lon'] = "NULL"
        print("No hotels here, I guess, skipping.")

hotel_df.to_csv('michelin_hotels.csv')