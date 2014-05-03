// Code wildly adapted from Mark's Nuclear Bomb Test mapping example

var BMlocations= [];
var BMpointsOnMap = new Backbone.Collection;

function BMloadLocations() {
    d3.csv("Data/Locations.csv",function(error,data){
        
        data.map(function(d){

                BMlocations.push({
                        name: d["Place"],
                        latitude: parseFloat(d["Latitude"]),
                        longitude: parseFloat(d["Longitude"]),
                        uncertain: d["Uncertain"],
                        fillKey: "bubbleFill"
                })

            })
                    
//        console.log(locations);
//        console.log(projection(locations[0]));

        
        BMpointsOnMap.add(BMlocations);
        BMdrawMap();
    });
}
 BMloadLocations();

    //prep the data

function BMdrawMap() {
    var BMmap = new Datamap({
       scope: 'world',
       element: document.getElementById("container2"),
       setProjection: function(element) {
            var projection = d3.geo.equirectangular()
                .center([1.27, 54])
                .rotate([4.4, 0])
                .scale(3500)
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
    
    BMpointsOnMap.each(function(val, idx) {
        BMpointsOnMap.at(idx).set('radius', 10);
    });
    
     BMmap.bubbles(BMpointsOnMap.toJSON(), { popupTemplate: function (geo, data) { 
        return ['<div class="hoverinfo"><strong>' + data.name+ '</strong>',
                '<br/>Uncertain:' + data.uncertain + '',
                '</div>'].join('');
        }
        });
        
   
BMmap.arc([
  {
      origin: {
          latitude: 54.0919685,
          longitude: -1.377826
      },
      destination: {
          latitude: 54.3685197,
          longitude: -1.720979
      },
      options: {
        strokeWidth: 2,
        strokeColor: 'rgba(204, 0, 255, 0.4)'
      }
  },
  {
      origin: {
          latitude: 54.3685197,
          longitude: -1.720979
      },
      destination: {
          latitude: 54.652579,
          longitude: -1.6757595
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
          latitude: 54.0919685,
          longitude: -1.377826
      },
      options: {
        strokeWidth: 2,
        strokeColor: 'rgba(204, 0, 255, 0.4)'
      }
  },
  {
      origin: {
          latitude: 54.978997,
          longitude: -2.0216083
      },
      destination: {
          latitude: 54.652579,
          longitude: -1.6757595
      },
      options: {
        strokeWidth: 2,
        strokeColor: 'rgba(204, 0, 255, 0.4)'
      }
  }
],  {strokeWidth: 1, arcSharpness: 1.4});

}


