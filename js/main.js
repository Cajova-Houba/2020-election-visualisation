/**
 * Only map related scripts here.
 */

const newPoint = function(latLon, mul) {
    return new ol.geom.Point(ol.proj.transform([
        latLon[1],
        latLon[0] + 0.001*mul
        ], 'EPSG:4326','EPSG:3857'));
}

const partyFilter = function(party) {
    // ignore BEZPP
    // return "BEZPP ".localeCompare(party) == 0

    // use only SPD and KSČM
    var filterVal = true;
    allowedParties.forEach(allowedParty => {
      filterVal &= allowedParty.localeCompare(party) != 0;
    });

    return filterVal;
}

var clusterFeatures = new Array(0);

function reLoadFeatures() {
  clusterFeatures.length = 0;

  for (var city in cityPartyCount) {
    var i = 0;
    var maxParty = "";
    var maxPartyCount = -1;
    for (var party in cityPartyCount[city]) {
        if (partyFilter(party)) {
            continue;
        }

        if (cityPartyCount[city][party] > maxPartyCount) {
            maxPartyCount = cityPartyCount[city][party];
            maxParty = party;
        }
    }

    if (maxPartyCount > -1) {
        clusterFeatures.push(new ol.Feature({
            geometry: newPoint(cityLatLon[city], 0),
            name: maxParty,
            colour: partyColours[maxParty],
            size: maxPartyCount
        }));
    }
  }
}
reLoadFeatures();


var clusterVectorSource = new ol.source.Vector({
    features: clusterFeatures,
});

var clusterSource = new ol.source.Cluster({
    source: clusterVectorSource,
});

var clusterLayer = new ol.layer.Vector({
    source: clusterSource,
    style: function(feature) {
        const featureName = feature.get("features")[0].get("name");
        const featureColour = feature.get("features")[0].get("colour");
        const featureSize = feature.get("features")[0].get("size");

        return new ol.style.Style({
            image: new ol.style.Circle({
              radius: 30,
              stroke: new ol.style.Stroke({
                color: '#fff',
              }),
              fill: new ol.style.Fill({
                color: featureColour,
              }),
            }),
            text: new ol.style.Text({
              text: featureName + ' ' + featureSize,
              fill: new ol.style.Fill({
                color: '#fff',
              }),
            }),
          });
    }
});

var rasterLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

var map = new ol.Map({
    target: 'map',
    layers: [
      rasterLayer, 
      clusterLayer,
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([14.0381357,50.6603327]),
      zoom: 10
    })
});

function reloadVectorLayer() {
  reLoadFeatures();
  var clusterVectorSource = new ol.source.Vector({
    features: clusterFeatures,
  });

  var clusterSource = new ol.source.Cluster({
      source: clusterVectorSource,
  });

  clusterLayer.setSource(clusterSource);
}
