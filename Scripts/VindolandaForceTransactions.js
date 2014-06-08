// Code adapted from examples and tutorial on Delimited --> http://www.delimited.io/blog/2013/12/19/force-bubble-charts-in-d3

d3.csv('Data/TransactionData.csv', function (error, data) {

        var width = 600, height = 600;
        var fill = d3.scale.ordinal().range(['#827d92','#827354','#523536','#72856a','#2a3285','#383435'])
        var svg = d3.select("#transactionchart").append("svg")
            .attr("width", width)
            .attr("height", height);

        _.each(data, function (elem) {
          elem.radius = 5;
          elem.x = _.random(0, width);
          elem.y = _.random(0, height);
        })

        var padding = 2;
        var maxRadius = d3.max(_.pluck(data, 'radius'));

         function getCenters(vname, w, h) {
          var v = _.uniq(_.pluck(data, vname)), c =[];
          var l = d3.layout.treemap().size([w, h]).ratio(1/1);
          _.each(v, function (k, i) { c.push({name: k, value: 1}); });
          return _.object(v,l.nodes({children: c})[0].children);
        }

        var nodes = svg.selectAll("circle")
          .data(data);

        nodes.enter().append("circle")
          .attr("class", "node")
          .attr("cx", function (d) { return d.x; })
          .attr("cy", function (d) { return d.y; })
          .attr("r", function (d) { return d.radius; })
          .style("fill", function (d) { return fill(d.make); })
        .on("mouseover", function (d) { showPopover.call(this, d); })
          .on("mouseout", function (d) { removePopovers(); })


        var force = d3.layout.force()
          .charge(0)
          .gravity(0)
          .size([width, height])

        draw('Period');


        function draw (varname) {
          var foci = getCenters(varname, 600, 600);
          force.on("tick", tick(foci, varname, .55));
          labels(foci)
          force.start();
        }

       function tick (foci, varname, k) {
          return function (e) {
           data.forEach(function (o, i) {
              var f = foci[o[varname]];
              o.y += ((f.y + (f.dy / 2)) - o.y) * k * e.alpha;
              o.x += ((f.x + (f.dx / 2)) - o.x) * k * e.alpha;
            });
            nodes
              .each(collide(.1))
              .attr("cx", function (d) { return d.x; })
              .attr("cy", function (d) { return d.y; });
          }
        }


function labels (foci) {
          svg.selectAll(".label").remove();

          svg.selectAll(".label")
          .data(_.toArray(foci)).enter().append("text")
          .attr("class", "label")
          .text(function (d) { return d.name })
          .attr("transform", function (d) {
            return "translate(" + (d.x + (d.dx / 2)) + ", " + (d.y + 20) + ")";
          });
        }


		 function removePopovers () {
          $('.popover').each(function() {
            $(this).remove();
          }); 
        }

        function showPopover (d) {
          $(this).popover({
            placement: 'auto top',
            container: 'body',
            trigger: 'manual',
            html : true,
            content: function() { 
              return "<strong>Tablet: </strong> <span style='color:blue'>" + d.Tablet + "</span><br/><strong>Supplier: </strong><span style='color:blue'>" + d.SupplierSellerCreditor + 
                     "</span><br/><strong>Receiver: </strong><span style='color:blue'>" + d.ReceiverPayer + "</span><br/><strong>Commodity: </strong><span style='color:blue'>" + d.Commodity + "</span><br/><strong>Type of Transaction: </strong><span style='color:blue'>" + d.TransactionType + "</span>"; }
          });
          $(this).popover('show')
        }

  		
        function collide(alpha) {
          var quadtree = d3.geom.quadtree(data);
          return function (d) {
            var r = d.radius + maxRadius + padding,
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function(quad, x1, y1, x2, y2) {
              if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + padding;
                if (l < r) {
                  l = (l - r) / l * alpha;
                  d.x -= x *= l;
                  d.y -= y *= l;
                  quad.point.x += x;
                  quad.point.y += y;
                }
              }
              return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
          };
        }
      });