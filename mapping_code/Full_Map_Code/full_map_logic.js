// Creating the map object
var myMap = L.map("map", {
    center: [38, -8.545892],
    zoom: 2
});
  
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
  
// Get the data with d3.
d3.json('Michelin_Data_Final.json').then(function(response) {
  
    console.log(response);

    // Create a new marker cluster group.
    var markers = L.markerClusterGroup();
  
    var data = response.results;

    // Loop through the data.
    for (var i = 0; i < data.length; i++) {
        var restaurant = data[i];
  
        // Add a new marker to the cluster group, and bind a popup.
        markers.addLayer(L.marker([restaurant.lat, restaurant.lon])
          .bindPopup(restaurant.name));
      }
  
    // Add our marker cluster layer to the map.
    myMap.addLayer(markers);
  });