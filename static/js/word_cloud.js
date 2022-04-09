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
            "size":counts[key]
        })
    })
   
     // -------------- Word Cloud D3 Code
    var width=1000,  
    height=1000;

    // --------------- Data Source for D3 Code  
var data2=dict
    .map(function(d) {return {text: d["text"], size: +d["size"]}})

    var wordscale= d3.scaleLinear().range([10,60]);

var fill = d3.scaleOrdinal(d3.schemeCategory10);

wordscale.domain([
    d3.min(data2,function(d){return d["size"]}),
    d3.max(data2,function(d){return d["size"]})
])

d3.layout.cloud().size([width, height])
      .words(data2)
      .padding(0)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .text(function(d) { return d["text"]; }) 
      .fontSize(function(d) { return wordscale(d["size"]); })
      .on("end", draw)
      .start();

  function draw(words) {
    d3.select("#word-cloud").append("g")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate("+(width/2)+","+(height/2))
      .selectAll("text")
        .data(words)
      .enter().append("text")
      .style("fill", function(d, i) { return fill(i); })
        .style("font-size", function(d) { return d["size"] + "px"; })
        .style("font-family", "Impact")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [Math.abs(d.x), Math.abs(d.y)] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d["text"]; });
  }
});
