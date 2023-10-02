const url = "http://127.0.0.1:5000/api/v1.0/airquality_data";
const coordinate = {"type": "Point", "coordinates": [-119.39, 58.49]}; // longitude and latitude
var json_data = {"type": "FeatureCollection","features":[]};

function convert_2geojson(data){
  for(let i = 0; i < data.length; i++) {
    json_data.features.push({
      "type": "Feature",
      "geometry": coordinate,
      "properties": {
        'aqi': data[i]['aqi'],
        'time': data[i]['date']
      }
    })
  };
};


function addGeoJSONLayer(map, data) {
  let mapIdObj = [];

  var geoJSONLayer = L.geoJSON(data, {
      pointToLayer: function (feature, latLng) {
        //00ffbc
        var color = "#00ffbc";
        if (feature.properties.aqi == '2') {
            color = "#ffff00";
        } else if (feature.properties.aqi == '3') {
            color = "#ffb100";
        } else if (feature.properties.aqi == '4') {
            color = "#ff7300";
        } else if (feature.properties.aqi == '5') {
            color = "#ff0000";
        }
        var pointIcon = {
          radius: 50,
          fillColor: color,
          color: color,
          weight: 0.5,
          opacity: 0.5,
          fillOpacity: 0.5
        }

        return L.circleMarker(latLng, pointIcon);
      }
    });

  var geoJSONTDLayer = L.timeDimension.layer.geoJson(geoJSONLayer, {
      updateTimeDimension: true,
      duration: 'PT2M',
      updateTimeDimensionMode: 'intersect',
      addlastPoint: false
  });

  geoJSONTDLayer.addTo(map);
}

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  // console.log(data);
  convert_2geojson(data);

  var map = L.map('map', {
      zoom: 5,
      fullscreenControl: true,
      timeDimensionControl: true,
      timeDimensionControlOptions: {
          timeSliderDragUpdate: true,
          loopButton: true,
          autoPlay: true,
          playerOptions: {
              transitionTime: 1000,
              loop: false
          }
      },
      timeDimension: true,
      center: [58.49, -119.39]
  });

  var osmLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
  });
  osmLayer.addTo(map);



  addGeoJSONLayer(map, json_data)

  var cDriftLegend = L.control({
    position: 'bottomright'
  });
  cDriftLegend.onAdd = function(map) {
      var div = L.DomUtil.create('div', 'info legend');
      div.innerHTML += '<ul><li class="aqi1">aqi 1</li><li class="aqi2">aqi 2</li><li class="aqi3">aqi 3</li><li class="aqi4">aqi 4</li><li class="aqi5">aqi 5</li></ul>';
      return div;
  };
  cDriftLegend.addTo(map);
});
