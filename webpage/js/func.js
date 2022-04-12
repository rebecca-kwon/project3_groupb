// create functions to create datasets to be referenced by the plots and maps
// First to populate the dropdown menu lists, "Cities" and "Cuisines" (with autofill code too)
// Then, a function to truncate the list based on the value for "Cities" being selected first
// Then, a function to truncate the list based on the value for "Cuisines" being selected first
"use strict";
// import and assign the whole dataset
const restaurants_json = "https://raw.githubusercontent.com/rebecca-kwon/project3_groupb/main/Michelin_Source/Michelin_Data_Final.json";
var data;
// create variables to target dropdowns
const dropdownCuisine = d3.select("#selCuisine");
const dropdownCity = d3.select("#selCity");
var middleData = [];
var finalData = [];
var best_hotel = {"Hotel_Name":"","h_lat":"0","h_lon":"0"};
// Josh's functions to autofill the dropdowns
// Code pulled from W3 schools - https://www.w3schools.com/howto/howto_js_filter_dropdown.asp
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function cuisineFunction() {
    document.getElementById("selCuisine").classList.toggle("show");
  }
function filterFunction() {
var input, filter, ul, li, a, i;
input = document.getElementById("myInput");
filter = input.value.toUpperCase();
div = document.getElementById("selCuisine");
a = div.getElementsByTagName("a");
for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
    a[i].style.display = "";
    } else {
    a[i].style.display = "none";
    }
}
}
function cityFunction() {
    document.getElementById("selCity").classList.toggle("show");
  }
function filterFunction() {
var input, filter, ul, li, a, i;
input = document.getElementById("myInput");
filter = input.value.toUpperCase();
div = document.getElementById("selCity");
a = div.getElementsByTagName("a");
for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
    a[i].style.display = "";
    } else {
    a[i].style.display = "none";
    }
}
}
// create a sorting function that can be called to remove duplicate values from a list
// by create, I mean steal from stackoverflow question 9229645
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}
// makea function to count occurrences in a list and pair them into lists
function countOccurrences (array) {
    let a = [],
      b = [],
      arr = [...array], // clone array so we don't change the original when using .sort()
      prev;
    arr.sort();
    for (let element of arr) {
      if (element !== prev) {
        a.push(element);
        b.push(1);
      }
      else ++b[b.length - 1];
      prev = element;
    }
    let occurness = []
    for (let i = 0; i < a.length; i++) {
        occurness.push([a[i],parseInt(b[i])])
      }
    return occurness;
}
function makeBarChart() {
    // Define the chart to be drawn. List of lists. sublists are rows
    // if cuisine is selected, show top 10 cities with that cuisine
    // out of cuisine,
    let citiesholding = []
    middleData.forEach(value => {
        citiesholding.push(value.city);
    });
    var info = new google.visualization.DataTable();
    info.addColumn('string','City');
    info.addColumn('number','Restaurants');
    info.addRows(countOccurrences(citiesholding))
     let options = {title: `Top ${countOccurrences(citiesholding).length} Cities For ${dropdownCuisine.node().value} Food`};
     // Instantiate and draw the chart.
     let chart = new google.visualization.BarChart(document.getElementById('container'));
     chart.draw(info, options);
}
// make a pie chart to show the number of stars in the restaurants in the city
function makePieChart() {
    // Define the chart to be drawn. List of lists. sublists are rows
    // if cuisine is selected, show top 10 cities with that cuisine
    // out of cuisine,
    let cuisineholding = []
    middleData.forEach(value => {
        cuisineholding.push(value.cuisine1);
    });
    var info = new google.visualization.DataTable();
    info.addColumn('string','Cuisine');
    info.addColumn('number','Restaurants');
    info.addRows(countOccurrences(cuisineholding))
     let options = {title: `Top ${countOccurrences(cuisineholding).length} Cuisine For ${dropdownCity.node().value}`};
     // Instantiate and draw the chart.
     let chart = new google.visualization.PieChart(document.getElementById('container'));
     chart.draw(info, options);
}
function createMap() {
    console.log(finalData);
    console.log(best_hotel);
    var redIcon = new L.Icon({
        iconUrl: '../images/marker-icon-red.png',
        shadowUrl: '../images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    var restIcon = new L.Icon({
        iconUrl: '../images/restaurant-icon.png',
        shadowUrl: '../imgages/marker-shadow.png',
        iconSize: [35, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    // Create an initial map object w/ location at hotel
    var myMap = L.map("map", {
        center: [best_hotel.h_lat, best_hotel.h_lon],
        zoom: 12.5,
    });
    // Add tile layer to map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(myMap);
    // Add hotel to map
    L.marker([best_hotel.h_lat, best_hotel.h_lon], {icon: redIcon})
    .bindPopup(`<h1>${best_hotel.Hotel_Name}</h1>`)
    .addTo(myMap);
    // Add markers to map
        // Loop through the restaurants array.
    finalData.forEach(value => {
        // lat = value.lat;
        // lon = value.lon;
        // title = value.name;
        // cuisine1 = value.cuisine1;
        // michelin_award = value.michelin_award;
        // For each restaurant, create a marker, and bind a popup with the station's name.
            L.marker([value.lat, value.lon], {icon: restIcon})
                .bindPopup(`<h1>${value.name}</h1> <hr> <h3>Cuisine: ${value.cuisine1}</h3> <hr> <h3>Michelin Stars ${value.michelin_award}`)
                .addTo(myMap)
    });
}
// establish the function to create the dataset when both dropdowns have options selected
function bothSelected() {
    middleData.forEach(value => {
        if (value.cuisine1 === dropdownCuisine.node().value &&
        value.city === dropdownCity.node().value) {
            finalData.push(value);
        }
    });
    console.log(finalData)

    let hotelArray = [];
    finalData.forEach(value => {
        hotelArray.push(value.Hotel_Name)
    });
    if (hotelArray.length > 1) {
        var mf = 1;
        var m = 0;
        var item;
        for (var i=0; i<hotelArray.length; i++) {
            for (var j=i; j<hotelArray.length; j++)
            {
                if (hotelArray[i] == hotelArray[j])
                m++;
                if (mf<m)
                {
                mf=m;
                item = hotelArray[i];
                }
            }
            m=0;
        }
    }
    else {
        item = hotelArray[0];
        mf = 1
    }
    //logging for data tracking
    // console.log(item+" ( " +mf +" times ) ") ;
    // console.log(hotelArray)
    //establish the best_hotel variable for referencing
    finalData.forEach(value => {
        if (value.Hotel_Name === item) {
            best_hotel.Hotel_Name = value.Hotel_Name;
            best_hotel.h_lat = value.h_lat;
            best_hotel.h_lon = value.h_lon;
        }
    });
    createMap()
}
// create the function that will parse the dataset to only contain the the restaurants
// with the cuisine that is selected
function cuisineChanged(food) {
    let cities = [""];
    if (dropdownCity.node().value === "") {
        dropdownCity.text([""])
        data.results.forEach(value => {
                if (value.cuisine1 === food) {
                    middleData.push(value);
                }
            });
            console.log(middleData);
            makeBarChart()
    }
    else {
        bothSelected()
    }
    middleData.forEach(value => {
        cities.push(value.city);
    });
    Object.values(uniq(cities)).forEach(x => {
        dropdownCity.append("option").text(x).property("value")
    });
    //console.log(cities);
    //console.log(data);
    //console.log(middleData);
}
// create the function that will parse the dataset to only contain the the restaurants
// with the city that is selected
function cityChanged(city) {
    let cuisines = [""];
    if (dropdownCuisine.node().value === "") {
        dropdownCuisine.text([""])
        data.results.forEach(value => {
                if (value.city === city) {
                    middleData.push(value);
                }
            });
            makePieChart()
    }
    else {
        bothSelected()
    }
    middleData.forEach(value => {
        cuisines.push(value.cuisine1);
    });
    Object.values(uniq(cuisines)).forEach(x => {
        dropdownCuisine.append("option").text(x).property("value")
    });
    //console.log(cities);
    //console.log(data);
    //console.log(middleData);
}
// create an initialization function to populate the dropdowns
function init() {
    //pull the data
    //create a list of unique cities from the dataset
    d3.json(restaurants_json).then(
        rData => {
            data = rData;
            // create list with blank string as default to populate dropdowns
            let cuisines = [""];
            let cities = [""];
            //push data into the lists
            Object.values(data.results).forEach(entry => {
                cities.push(entry.city),
                cuisines.push(entry.cuisine1);
            });
            console.log(data.results)
            //append the dropdown for cities with the options and sort/remove duplicates
            Object.values(uniq(cities)).forEach(x => {
                dropdownCity.append("option").text(x).property("value")
            });
            //append the dropdown for Cuisines with the options and sort/remove duplicates
            Object.values(uniq(cuisines)).forEach(x => {
                dropdownCuisine.append("option").text(x).property("value")
            });
        }
    );
}
// a function to be attached to a button to reset the dropdowns and dataset
function re_init() {
    // create list with blank string as default to populate dropdowns
    let cuisines = [""];
    let cities = [""];
    //push data into the lists
    Object.values(data.results).forEach(entry => {
        cities.push(entry.city),
        cuisines.push(entry.cuisine1);
    });
    //append the dropdown for cities with the options and sort/remove duplicates
    Object.values(uniq(cities)).forEach(x => {
        dropdownCity.append("option").text(x).property("value")
    });
    //append the dropdown for Cuisines with the options and sort/remove duplicates
    Object.values(uniq(cuisines)).forEach(x => {
        dropdownCuisine.append("option").text(x).property("value")
    });
}
init();