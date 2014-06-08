
var marginTT = {top: 30, right: 20, bottom: 30, left: 20};

var widthTT = 300 - margin.left - margin.right,
    heightTT = 300 - margin.top - margin.bottom,
    radiusTT = Math.min(widthTT, heightTT) / 2;

var colorTT = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arcTT = d3.svg.arc()
    .outerRadius(radiusTT - 10)
    .innerRadius(0);

var pieTT = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.Transactions; });

var svgTT = d3.select("#square4").append("svg")
    .attr("width", widthTT + marginTT.left + marginTT.right)
    .attr("height", heightTT + marginTT.top + marginTT.bottom)
  .append("g")
  .attr("transform", "translate(" + widthTT / 2 + "," + heightTT / 2 + ")");

var tipTT = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Transaction Type:</strong> <span style='color:blue'>" + d.data.Type + "</span>";
  })

svgTT.call(tipTT);

d3.csv("Data/TransactionTypes.csv", function(error, data) {

  data.forEach(function(d) {
    d.Transactions = +d.Transactions;
  });
  
        
  var f = svgTT.selectAll(".arc")
      .data(pieTT(data))
    .enter().append("g")
      .attr("class", "arc");

  f.append("path").attr("d", arcTT).style("fill", function(d) { return colorTT(d.data.Type); }).on('mouseover', tipTT.show)
      .on('mouseout', tipTT.hide);;
      
svgTT.append("text")
        .attr("x", (widthTT / 2) -220)             
        .attr("y", -106)
        .attr("text-anchor", "middle")  
        .style("font-size", "13px") 
        .text("By Type");

      

        
});