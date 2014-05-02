var margin = {top: 30, right: 20, bottom: 30, left: 20};

var width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.Transactions; });

var svg = d3.select("#square2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Period:</strong> <span style='color:blue'>" + d.data.Period + "</span>";
  })

svg.call(tip);

d3.csv("Data/PeriodTransactions.csv", function(error, data) {

  data.forEach(function(d) {
    d.Transactions = +d.Transactions;
  });

  var x = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  x.append("path").attr("d", arc).style("fill", function(d) { return color(d.data.Period); }).on('mouseover', tip.show)
      .on('mouseout', tip.hide);
      
      svg.append("text")
        .attr("x", (widthTT / 2) -220)             
        .attr("y", -106)
        .attr("text-anchor", "middle")  
        .style("font-size", "13px") 
        .text("By Period");


});