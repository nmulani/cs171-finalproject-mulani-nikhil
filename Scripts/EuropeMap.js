// Code wildly adapted from Mark's Nuclear Bomb Test mapping example

var locations= [];
var pointsOnMap = new Backbone.Collection;

function loadLocations() {
    d3.csv("Data/Locations.csv",function(error,data){
        
        data.map(function(d){

                locations.push({
                        name: d["Place"],
                        latitude: parseFloat(d["Latitude"]),
                        longitude: parseFloat(d["Longitude"]),
                        uncertain: d["Uncertain"],
                        fillKey: "bubbleFill"
                })

            })
                    
        
        pointsOnMap.add(locations);
        drawMap();
    });
}
 loadLocations();

    //prep the data

function drawMap() {
    var map = new Datamap({
       scope: 'world',
       element: document.getElementById("container1"),
       setProjection: function(element) {
            var projection = d3.geo.equirectangular()
                .center([7, 48])
                .rotate([4.4, 0])
                .scale(1300)
                .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
            var path = d3.geo.path()
                .projection(projection);
           
            return {path: path, projection: projection};
        },
        fills: {
            defaultFill: "#DDD",
            bubbleFill: '#000'
        },
        geographyConfig: {
            dataUrl: '/Scripts/world.topo.hi-res.json',
            hideAntarctica: true,
            borderWidth: 0.5,
            borderColor: '#222',
            popupTemplate: function(geography, data) { //this function should just return a string
              return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong></div>';
            },
            popupOnHover: true, //disable the popup while hovering
            highlightOnHover: true,
            highlightFillColor: '#FC8D59',
            highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
            highlightBorderWidth: 2
        }
    });
    
    pointsOnMap.each(function(val, idx) {
        pointsOnMap.at(idx).set('radius', 10);
    });
    
     map.bubbles(pointsOnMap.toJSON(), { popupTemplate: function (geo, data) { 
        return ['<div class="hoverinfo"><strong>' + data.name+ '</strong>',
                '<br/>Uncertain:' + data.uncertain + '',
                '</div>'].join('');
        }
        });
    
map.arc([
  {
      origin: {
          latitude: 41.9100711,
          longitude: 12.5359979
      },
      destination: {
          latitude: 48.8588589,
          longitude: 2.3470599
      },
      options: {
        strokeWidth: 2,
        strokeColor: 'rgba(204, 0, 255, 0.4)'
      }
  },
  {
      origin: {
          latitude: 48.8588589,
          longitude: 2.3470599
      },
      destination: {
          latitude: 51.5286416,
          longitude: -0.1015987
      },
      options: {
        strokeWidth: 2,
        strokeColor: 'rgba(204, 0, 255, 0.4)'
      }
  },
  {
      origin: {
          latitude: 51.5286416,
          longitude: -0.1015987
      },
      destination: {
          latitude: 54.978997,
          longitude: -2.0216083
      },
      options: {
        strokeWidth: 2,
        strokeColor: 'rgba(204, 0, 255, 0.4)'
      }
  }
],  {strokeWidth: 1, arcSharpness: 1.4});

}
