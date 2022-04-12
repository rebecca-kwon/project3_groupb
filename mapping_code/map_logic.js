// Add custom marker for map
var redIcon = new L.Icon({
	iconUrl: 'img/marker-icon-red.png',
	shadowUrl: 'img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var restIcon = new L.Icon({
	iconUrl: 'img/restaurant-icon.png',
	shadowUrl: 'img/marker-shadow.png',
	iconSize: [35, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

// add hotel
var best_hotel = {"Hotel_Name":"Four Seasons Hotel New York Downtown","h_lat":"40.7126317","h_lon":"-74.0091904"}
;

function createMap(Restaurants) {

// Add tile layer to map
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

// Create a baseMaps object to hold the streetmap layer.
    var baseMaps = {
        "Street Map": streetmap
    };

// Create an overlayMaps object to hold the restaurants layer.
    var overlayMaps = {
        "Restaurants": Restaurants
    };

    // Create an initial map object w/ location at hotel
    var myMap = L.map("map", {
        center: [best_hotel.h_lat, best_hotel.h_lon],
        zoom: 12.5,
        layers: [streetmap, Restaurants]
    });

// Add hotel to map
    L.marker([best_hotel.h_lat, best_hotel.h_lon], {icon: redIcon})
    .bindPopup(`<h1>${best_hotel.Hotel_Name}</h1>`)
    .addTo(myMap);

// Layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}

function createMarkers(response) {

    console.log(response);

    // Initialize an array to hold bike markers.
    var restMarkers = [];
  
    // Loop through the restaurants array.
    Object.values(response).forEach(value => {
        lat = response[value.ind].lat;
        lon = response[value.ind].lon;
        title = response[value.ind].name;
        cuisine1 = response[value.ind].cuisine1;
        michelin_award = response[value.ind].michelin_award;

      // For each restaurant, create a marker, and bind a popup with the station's name.
        var restMarker = L.marker([lat, lon], {icon: restIcon})
            .bindPopup(`<h1>${title}</h1> <hr> <h3>Cuisine: ${cuisine1}</h3> <hr> <h3>Michelin Stars ${michelin_award}`)
  
      // Add the marker to the restMarkers array.
        restMarkers.push(restMarker);
    });
  
    // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
    createMap(L.layerGroup(restMarkers))

}

// load in JSON data
d3.json(finalData).then(createMarkers);