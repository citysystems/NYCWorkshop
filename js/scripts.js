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

function getColor(d) {
  return d < 8 ? '#4FDE02' :
      d < 16 ? '#A0EB15' :
      d < 29 ? '#E9D00E' :
      d < 38 ? '#E76607' :
      '#EC0803';
};
console.log(distances[0]);
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
          alert('Please choose values between 1 and 10! Value changed to 10 in index calculation.');
          absoluteAmenW[i].val(10);
      };
      if (absoluteAmenW[i].val() < 1) {
          alert('Please choose values between 1 and 10! Value changed to 1 in index calculation.');
          absoluteAmenW[i].val(1);
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
          alert('Please choose values between 1 and 10! Value changed to 10 in index calculation.');
          absoluteTransitW[i].val(10);
      };
      if (absoluteTransitW[i].val() < 1) {
          alert('Please choose values between 1 and 10! Value changed to 1 in index calculation.');
          absoluteTransitW[i].val(1);
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
  var absoluteAmenW = [$("#storeVal").val(), $("#pharmaVal").val(), $("#bankVal").val(), $("#supermarketVal").val(),
      $("#restaurantVal").val()];
  //marginal amenity calc: 1 - (1/(MarginalVal))
  var marginalAmenW = [(1-(1/$("#storeMVal").val())), (1-(1/$("#pharmaMVal").val())), (1-(1/$("#bankMVal").val())), (1-(1/$("#supermarketMVal").val())),
      (1-(1/$("#restaurantMVal").val()))];
  var absoluteTransitW = [$("#walkVal").val(), $("#bikeVal").val(), $("#transitVal").val(), $("#driveVal").val()];
  //marginal transit calc: -ln0.1/t(minutes)
  var marginalTransitW = [((-Math.log(0.1))/($("#walkMVal").val())), ((-Math.log(0.1))/($("#bikeMVal").val())), ((-Math.log(0.1))/($("#transitMVal").val())),
  ((-Math.log(0.1))/($("#transitMVal").val()))];
  parcel = layer.feature.properties.ID;
  console.log(parcel);
  score = 0;
  for (var i = 0; i < distances.length; i++) {
    walkScore = 0;
    bikeScore = 0;
    transitScore = 0;
    driveScore = 0;
    if (distances[i].origin == parcel) {
      if (distances[i].type == 'restaurant') {
        walkScore = walkScore + Math.exp(marginalTransitW[0]*distances[i]["Walk Time"]);
        bikeScore = bikeScore + Math.exp(marginalTransitW[1]*distances[i]["Bike Time"]);
        transitScore = transitScore + Math.exp(marginalTransitW[2]*distances[i]["Transit Time"]);
        driveScore = driveScore + Math.exp(marginalTransitW[3]*distances[i]["Drive Time"]);
        walkScore = walkScore * absoluteTransitW[0];
        bikeScore = bikeScore * absoluteTransitW[1];
        transitScore = transitScore * absoluteTransitW[2];
        driveScore = driveScore * absoluteTransitW[3];
        aggScore = walkScore + bikeScore + transitScore + driveScore;
        aggScore = aggScore * Math.pow(marginalAmenW[4],distances[i]["rank"]);
        aggScore = aggScore * absoluteAmenW[4];
        score += aggScore;
        console.log(score);
      }
      if (distances[i].type == 'bank') {
        walkScore = walkScore + Math.exp(marginalTransitW[0]*distances[i]["Walk Time"]);
        bikeScore = bikeScore + Math.exp(marginalTransitW[1]*distances[i]["Bike Time"]);
        transitScore = transitScore + Math.exp(marginalTransitW[2]*distances[i]["Transit Time"]);
        driveScore = driveScore + Math.exp(marginalTransitW[3]*distances[i]["Drive Time"]);
        walkScore = walkScore * absoluteTransitW[0];
        bikeScore = bikeScore * absoluteTransitW[1];
        transitScore = transitScore * absoluteTransitW[2];
        driveScore = driveScore * absoluteTransitW[3];
        aggScore = walkScore + bikeScore + transitScore + driveScore;
        aggScore = aggScore * Math.pow(marginalAmenW[2],distances[i]["rank"]);
        aggScore = aggScore * absoluteAmenW[2];
        score += aggScore;
        console.log(score);
      }
      if (distances[i].type == 'pharmacy') {
        walkScore = walkScore + Math.exp(marginalTransitW[0]*distances[i]["Walk Time"]);
        bikeScore = bikeScore + Math.exp(marginalTransitW[1]*distances[i]["Bike Time"]);
        transitScore = transitScore + Math.exp(marginalTransitW[2]*distances[i]["Transit Time"]);
        driveScore = driveScore + Math.exp(marginalTransitW[3]*distances[i]["Drive Time"]);
        walkScore = walkScore * absoluteTransitW[0];
        bikeScore = bikeScore * absoluteTransitW[1];
        transitScore = transitScore * absoluteTransitW[2];
        driveScore = driveScore * absoluteTransitW[3];
        aggScore = walkScore + bikeScore + transitScore + driveScore;
        aggScore = aggScore * Math.pow(marginalAmenW[1],distances[i]["rank"]);
        aggScore = aggScore * absoluteAmenW[1];
        score += aggScore;
        console.log(score);
      }
      if (distances[i].type == 'store') {
        walkScore = walkScore + Math.exp(marginalTransitW[0]*distances[i]["Walk Time"]);
        bikeScore = bikeScore + Math.exp(marginalTransitW[1]*distances[i]["Bike Time"]);
        transitScore = transitScore + Math.exp(marginalTransitW[2]*distances[i]["Transit Time"]);
        driveScore = driveScore + Math.exp(marginalTransitW[3]*distances[i]["Drive Time"]);
        walkScore = walkScore * absoluteTransitW[0];
        bikeScore = bikeScore * absoluteTransitW[1];
        transitScore = transitScore * absoluteTransitW[2];
        driveScore = driveScore * absoluteTransitW[3];
        aggScore = walkScore + bikeScore + transitScore + driveScore;
        aggScore = aggScore * Math.pow(marginalAmenW[0],distances[i]["rank"]);
        aggScore = aggScore * absoluteAmenW[0];
        score += aggScore;
        console.log(score);
      }
      if (distances[i].type == 'supermarket') {
        walkScore = walkScore + Math.exp(marginalTransitW[0]*distances[i]["Walk Time"]);
        bikeScore = bikeScore + Math.exp(marginalTransitW[1]*distances[i]["Bike Time"]);
        transitScore = transitScore + Math.exp(marginalTransitW[2]*distances[i]["Transit Time"]);
        driveScore = driveScore + Math.exp(marginalTransitW[3]*distances[i]["Drive Time"]);
        walkScore = walkScore * absoluteTransitW[0];
        bikeScore = bikeScore * absoluteTransitW[1];
        transitScore = transitScore * absoluteTransitW[2];
        driveScore = driveScore * absoluteTransitW[3];
        aggScore = walkScore + bikeScore + transitScore + driveScore;
        aggScore = aggScore * Math.pow(marginalAmenW[3],distances[i]["rank"]);
        aggScore = aggScore * absoluteAmenW[3];
        score += aggScore;
        console.log(score);
      };
    };
  };
    layer.feature.properties.score = score;
  //marginal good implementation = total transit score * MarginalAmenW(given type)^"rank"
  //util per transit: exp(marginal weighting * actual travel time)
  //marginal score per transit type, scale each according to absolute weights, sum together, marginal good weighting, scale by the absolute good weighting, add together
    if (layer.feature.properties && layer.feature.properties.score) {
        layer.bindPopup("Accessibility Score: " + layer.feature.properties.score);
    };
    layer.setStyle({
        fillColor: getColor(layer.feature.properties.score),
        weight: 0,
        opacity: 0,
        color: "lightgrey",
        // dashArray: '3',
        fillOpacity: 1
    });
};

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};
//
var lots = L.geoJSON(parcels, {
    onEachFeature: onEachFeature
});



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

legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [7,8,16,29,38],
        labels = ['< 8 minutes', "8-16 minutes", '17-29 minutes',
        '30-38 minutes', '> 38 minutes'];
    div.innerHTML = '<div><b>Time from Services</b></div>';

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
    "Parcels": lots,
    'Store': store,
    "Pharmacy": pharmacy,
    "Bank": bank,
    "Supermarket": supermarket,
    "Restaurant": restaurant
		};

L.control.layers(null, overlays).addTo(map);

// var bank
//
// var ST1=5;
// var ST2=1;
// var Walk=5;
// var Bike=2;
// var Transit=7;
// var Drive=5;
// var MarginalDestination=0.1;
//
// var features = parcels.features;
//
// var FC = {
//     type: 'FeatureCollection',
//     features: features,
//   };
// // filteredLayer.clearLayers();
//   // create a Leaflet geojson layer from the FeatureCollection
// var j = 0;
// var parkFeatures = parks.features;
// function updateScore(feature, layer) {
//   feature.properties.POLY_CODE = 0;
//   var score = 0;
//   for (var i = 0; i < parkFeatures.length; i++) {
//     var marginalDFactor = (1-(MarginalDestination*i))
//     if (marginalDFactor > 0) {
//         console.log(((bikeScores[i][j] * Bike) + (walkScores[i][j] * Walk) + (transitScores[i][j] * Transit) + (driveScores[i][j] * Drive)))
//         score += (marginalDFactor*((bikeScores[i][j] * Bike) + (walkScores[i][j] * Walk) + (transitScores[i][j] * Transit) + (driveScores[i][j] * Drive)));
//     } else {
//         score = score
//     }
//         // score += MarginalDestination*((bikeScores[i][j] * Bike) + (walkScores[i][j] * Walk) + (transitScores[i][j] * Transit) + (driveScores[i][j] * Drive));
//   };
//   console.log(score*ST1);
//   layer.feature.properties.POLY_CODE = score*ST1;
//   j = j + 1;
// };
// filteredLayer = L.geoJSON(FC, {
//   onEachFeature: updateScore,
// });
// console.log(filteredLayer);
