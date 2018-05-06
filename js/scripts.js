//Initialize tooltips
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});
//Create the map variable
var map = L.map('my-map', {
    scrollWheelZoom: false
}).setView([37.466351, -122.134677], 16);

//Add the basemap
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);

function getColorAmen(d) {
  switch (d) {
    case 'store':
      return '#57db6c';
    case 'pharmacy':
      return '#db5f57';
    case 'bank':
      return '#dbd657';
    case 'supermarket':
      return '#c957db';
    case 'restaurant':
      return '#db5777';
    default:
      return 'black';
    }
  };
scores = [];
maxScore = 0;
minScore = 0;
function onEachFeature(feature, layer) {
  //Get buttons
  var absoluteAmenW = [$("#storeVal"), $("#pharmaVal"), $("#bankVal"), $("#supermarketVal"),
      $("#restaurantVal")];
  var marginalAmenW = [$("#storeMVal"), $("#pharmaMVal"), $("#bankMVal"), $("#supermarketMVal"),
      $("#restaurantMVal")];
  var absoluteTransitW = [$("#walkVal"), $("#bikeVal"), $("#transitVal"), $("#driveVal")];
  var marginalTransitW = [$("#walkMVal"), $("#bikeMVal"), $("#transitMVal"), $("#driveMVal")];
  for (var i = 0; i < absoluteAmenW.length; i++) {
    absoluteAmenW[i].val(parseInt(absoluteAmenW[i].val()));
      if (absoluteAmenW[i].val() > 10 ) {
          alert('Please choose values between 0 and 10! Value changed to 10 in index calculation.');
          absoluteAmenW[i].val(10);
      };
      if (absoluteAmenW[i].val() < 0) {
          alert('Please choose values between 0 and 10! Value changed to 0 in index calculation.');
          absoluteAmenW[i].val(0);
      };
    };
  for (var i = 0; i < marginalAmenW.length; i++) {
    marginalAmenW[i].val(parseInt(marginalAmenW[i].val()));
      if (marginalAmenW[i].val() > 10 ) {
          alert('Please choose values between 1 and 10! Value changed to 10 in index calculation.');
          marginalAmenW[i].val(10);
      };
      if (marginalAmenW[i].val() < 1) {
          alert('Please choose values between 1 and 10! Value changed to 1 in index calculation.');
          marginalAmenW[i].val(1);
      };
    };
  for (var i = 0; i < absoluteTransitW.length; i++) {
    absoluteTransitW[i].val(parseInt(absoluteTransitW[i].val()));
      if (absoluteTransitW[i].val() > 10 ) {
          alert('Please choose values between 0 and 10! Value changed to 10 in index calculation.');
          absoluteTransitW[i].val(10);
      };
      if (absoluteTransitW[i].val() < 0) {
          alert('Please choose values between 0 and 10! Value changed to 1 in index calculation.');
          absoluteTransitW[i].val(0);
      };
    };
  for (var i = 0; i < marginalTransitW.length; i++) {
    marginalTransitW[i].val(parseInt(marginalTransitW[i].val()));
      if (marginalTransitW[i].val() > 30 ) {
          alert('Please choose values between 1 and 30! Value changed to 10 in index calculation.');
          marginalTransitW[i].val(30);
      };
      if (marginalTransitW[i].val() < 1) {
          alert('Please choose values between 1 and 30! Value changed to 1 in index calculation.');
          marginalTransitW[i].val(1);
      };
    };
  var absoluteAmenW = [parseInt($("#storeVal").val()), parseInt($("#pharmaVal").val()), parseInt($("#bankVal").val()), parseInt($("#supermarketVal").val()),
      parseInt($("#restaurantVal").val())];
  //marginal amenity calc: 1 - (1/(MarginalVal))
  var marginalAmenW = [(1-(1/$("#storeMVal").val())), (1-(1/$("#pharmaMVal").val())), (1-(1/$("#bankMVal").val())), (1-(1/$("#supermarketMVal").val())),
      (1-(1/$("#restaurantMVal").val()))];
  var absoluteTransitW = [parseInt($("#walkVal").val()), parseInt($("#bikeVal").val()), parseInt($("#transitVal").val()), parseInt($("#driveVal").val())];
  //marginal transit calc: -ln0.1/t(minutes)
  var marginalTransitW = [((Math.log(0.1))/($("#walkMVal").val())), ((Math.log(0.1))/($("#bikeMVal").val())), ((Math.log(0.1))/($("#transitMVal").val())),
  ((Math.log(0.1))/($("#transitMVal").val()))];
  parcel = layer.feature.properties.ID;
  score = 0;
  //marginal good implementation = total transit score * MarginalAmenW(given type)^"rank"
  //util per transit: exp(marginal weighting * actual travel time)
  //marginal score per transit type, scale each according to absolute weights, sum together, marginal good weighting, scale by the absolute good weighting, add together
  for (var i = 0; i < distances.length; i++) {
    walkScore = 0;
    bikeScore = 0;
    transitScore = 0;
    driveScore = 0;
    if (distances[i].origin == parcel) {
      if (distances[i].type == 'restaurant') {
        walkScore =  Math.exp(marginalTransitW[0]*distances[i]["Walk Time"]);
        // console.log(marginalTransitW[0]);
        // console.log(distances[i]["Walk Time"]);
        // console.log("Marginal Walk Score:" + walkScore);
        bikeScore =  Math.exp(marginalTransitW[1]*distances[i]["Bike Time"]);
        transitScore =  Math.exp(marginalTransitW[2]*distances[i]["Transit Time"]);
        driveScore =  Math.exp(marginalTransitW[3]*distances[i]["Drive Time"]);
        walkScore = walkScore * absoluteTransitW[0];
        // console.log("Absolute Walk Score:" + walkScore);
        bikeScore = bikeScore * absoluteTransitW[1];
        transitScore = transitScore * absoluteTransitW[2];
        driveScore = driveScore * absoluteTransitW[3];
        aggScore = walkScore + bikeScore + transitScore + driveScore;
        // console.log("Agg Score:" + aggScore);
        aggScore = aggScore * Math.pow(marginalAmenW[4],distances[i]["rank"]);
        // console.log("Agg Score:" + aggScore);
        aggScore = aggScore * absoluteAmenW[4];
        score += aggScore;
        // console.log(score);
      }
      if (distances[i].type == 'bank') {
        walkScore =  Math.exp(marginalTransitW[0]*distances[i]["Walk Time"]);
        bikeScore =  Math.exp(marginalTransitW[1]*distances[i]["Bike Time"]);
        transitScore =  Math.exp(marginalTransitW[2]*distances[i]["Transit Time"]);
        driveScore = Math.exp(marginalTransitW[3]*distances[i]["Drive Time"]);
        walkScore = walkScore * absoluteTransitW[0];
        bikeScore = bikeScore * absoluteTransitW[1];
        transitScore = transitScore * absoluteTransitW[2];
        driveScore = driveScore * absoluteTransitW[3];
        aggScore = walkScore + bikeScore + transitScore + driveScore;
        aggScore = aggScore * Math.pow(marginalAmenW[2],distances[i]["rank"]);
        aggScore = aggScore * absoluteAmenW[2];
        score += aggScore;
        // console.log(score);
      }
      if (distances[i].type == 'pharmacy') {
        walkScore =  Math.exp(marginalTransitW[0]*distances[i]["Walk Time"]);
        bikeScore =  Math.exp(marginalTransitW[1]*distances[i]["Bike Time"]);
        transitScore =  Math.exp(marginalTransitW[2]*distances[i]["Transit Time"]);
        driveScore =  Math.exp(marginalTransitW[3]*distances[i]["Drive Time"]);
        walkScore = walkScore * absoluteTransitW[0];
        bikeScore = bikeScore * absoluteTransitW[1];
        transitScore = transitScore * absoluteTransitW[2];
        driveScore = driveScore * absoluteTransitW[3];
        aggScore = walkScore + bikeScore + transitScore + driveScore;
        aggScore = aggScore * Math.pow(marginalAmenW[1],distances[i]["rank"]);
        aggScore = aggScore * absoluteAmenW[1];
        score += aggScore;
        // console.log(score);
      }
      if (distances[i].type == 'store') {
        walkScore =  Math.exp(marginalTransitW[0]*distances[i]["Walk Time"]);
        bikeScore =  Math.exp(marginalTransitW[1]*distances[i]["Bike Time"]);
        transitScore =  Math.exp(marginalTransitW[2]*distances[i]["Transit Time"]);
        driveScore =  Math.exp(marginalTransitW[3]*distances[i]["Drive Time"]);
        walkScore = walkScore * absoluteTransitW[0];
        bikeScore = bikeScore * absoluteTransitW[1];
        transitScore = transitScore * absoluteTransitW[2];
        driveScore = driveScore * absoluteTransitW[3];
        aggScore = walkScore + bikeScore + transitScore + driveScore;
        aggScore = aggScore * Math.pow(marginalAmenW[0],distances[i]["rank"]);
        aggScore = aggScore * absoluteAmenW[0];
        score += aggScore;
        // console.log(score);
      }
      if (distances[i].type == 'supermarket') {
        walkScore =  Math.exp(marginalTransitW[0]*distances[i]["Walk Time"]);
        bikeScore =  Math.exp(marginalTransitW[1]*distances[i]["Bike Time"]);
        transitScore =  Math.exp(marginalTransitW[2]*distances[i]["Transit Time"]);
        driveScore =  Math.exp(marginalTransitW[3]*distances[i]["Drive Time"]);
        walkScore = walkScore * absoluteTransitW[0];
        bikeScore = bikeScore * absoluteTransitW[1];
        transitScore = transitScore * absoluteTransitW[2];
        driveScore = driveScore * absoluteTransitW[3];
        aggScore = walkScore + bikeScore + transitScore + driveScore;
        aggScore = aggScore * Math.pow(marginalAmenW[3],distances[i]["rank"]);
        aggScore = aggScore * absoluteAmenW[3];
        score += aggScore;
        // console.log(score);
      };
    };
  };
  layer.feature.properties.score = score;
  if (layer.feature.properties && layer.feature.properties.score) {
      layer.bindPopup("Accessibility Score: " + layer.feature.properties.score + ", Parcel: " + layer.feature.properties.ID);
  };
  layer.setStyle({
      fillColor: getColor(layer.feature.properties.score),
      weight: 1,
      // dashArray: '3 10',
      // opacity: 0,
      color: "black",
      // dashArray: '3',
      fillOpacity: 0.75
  });
  if (score > maxScore) {
    maxScore = score;
  };
  if (score < minScore) {
    minScore = score;
  }
};

var store = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.type === "store");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 10, fillOpacity: 0.85, color: getColorAmen(feature.properties.type)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.name
        )
        }
  });

var pharmacy = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.type === "pharmacy");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 10, fillOpacity: 0.85, color: getColorAmen(feature.properties.type)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.name
        )
        }
  });

var bank = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.type === "bank");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 10, fillOpacity: 0.85, color: getColorAmen(feature.properties.type)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.name
        )
        }
  });

var supermarket = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.type === "supermarket");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 10, fillOpacity: 0.85, color: getColorAmen(feature.properties.type)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.name
        )
        }
  });

var restaurant = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.type === "restaurant");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 10, fillOpacity: 0.85, color: getColorAmen(feature.properties.type)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.name
        )
        }
  });

var legend = L.control({
    position: 'topright'
});
function getColor(d) {
  return d < 1 ? '#4FDE02' :
      d < 5 ? '#A0EB15' :
      d < 10 ? '#E9D00E' :
      d < 20 ? '#E76607' :
      '#EC0803';
};
legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0,1,9,19,40],
        labels = ['Less than 1', "1-5", '5-10',
        '10-20', '20+'];
    div.innerHTML = '<div><b>Accessibility Score</b></div>';

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += '<i style="background:' + getColor(grades[i]) + '">&nbsp;</i>&nbsp;&nbsp;' +
            labels[i] + '<br/>';
    }

    return div;
};

legend.addTo(map);


var legend1 = L.control({
    position: 'bottomleft'
});

legend1.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = ['store', 'pharmacy', 'bank', 'supermarket', 'restaurant'];
        labels = ["Store", "Pharmacy", "Bank", "Supermarket", "Restaurant"];
    div.innerHTML = '<div><b>Amenity Type</b></div>';

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += '<i style="background:' + getColorAmen(grades[i]) + '">&nbsp;</i>&nbsp;&nbsp;' +
            labels[i] + '<br/>';
    }

    return div;
};

legend1.addTo(map);


var overlays = {
    'Store': store,
    "Pharmacy": pharmacy,
    "Bank": bank,
    "Supermarket": supermarket,
    "Restaurant": restaurant
		};

L.control.layers(null, overlays).addTo(map);

var filteredLayer = L.geoJSON(parcels, {
  onEachFeature: onEachFeature,
});

function updateMap() {
  maxScore = 0;
  minScore = 0;
  var features = parcels.features
  var FC = {
    type: 'FeatureCollection',
    features: features,
  };
  filteredLayer.clearLayers();
  // create a Leaflet geojson layer from the FeatureCollection
  filteredLayer = L.geoJSON(FC, {
    onEachFeature: onEachFeature,
  });
  // steps = (maxScore - minScore)/5
  // function getColor(d) {
  //   return d < minScore + steps ? '#4FDE02' :
  //       d < minScore + 2*steps ? '#A0EB15' :
  //       d < minScore + 3*steps ? '#E9D00E' :
  //       d < minScore + 4*steps ? '#E76607' :
  //       '#EC0803';
  // };
  // filteredLayer = L.geoJSON(FC, {
  //   onEachFeature: onEachFeature,
  // });
  // filteredLayer.setStyle({
  //   fillColor: getColor(filteredLayer.feature.properties.score),
  //   weight: 1,
  //   // dashArray: '3 10',
  //   // opacity: 0,
  //   color: "black",
  //   // dashArray: '3',
  //   fillOpacity: 0.75
  // });
  console.log(maxScore);
  console.log(minScore);
  filteredLayer.addTo(map);
};
//first map populated!
updateMap();
console.log(filteredLayer);
