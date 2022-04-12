d3.json("/data").then((data) => {
  let sampleData=data.results;

  let cuisines=[];
  let counts={};
  var dict=[];

  // -------------- Grabbing all Cuisines 
  Object.keys(sampleData).forEach(key => {
      cuisines.push(sampleData[key].cuisine1);
  });
  
   // -------------- Counting frequency of each cuisine
  for (const num of cuisines) {
      counts[num] = counts[num] ? counts[num] + 1 : 1;        
  }

  // -------------- Creating Dictionary to match Word Cloud input
  Object.keys(counts).forEach(key => {
      dict.push({
          "text":key,
          "count":counts[key]
      })
  })

  var data2=dict
        .map(function(d) {return {text: d["text"], count: +d["count"]}});


        console.log(data2)
  ZC.LICENSE = ["569d52cefae586f634c54f86dc99e6a9", "b55b025e438fa8a98e32482b5f768ff5"];
  var myConfig = {
    "graphset": [{
      "type": "wordcloud",
      "options": {
        "style": {
          "tooltip": {
            visible: true,
            text: '%text: %hits'
          }
        },
      'words':data2
    
      }
    }]
  };
   
  zingchart.render({
    id: 'myChart',
    data: myConfig,
    height: '100%',
    width: '100%'
  });

});
