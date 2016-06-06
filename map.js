// Leaflet map code
$(document).ready(function() {
    var currentLayer,
        currentBounds,
        mapCenterLat = 39.8282, // Default location settings
        mapCenterLon = -98.5795,
        mapZoom = 4;

    if('geolocation' in navigator){
		var options = {
		   enableHighAccuracy: false, 
		};

		navigator.geolocation.getCurrentPosition(function (pos) {
		   mapCenterLat = pos.coords.latitude;
		   mapCenterLon = pos.coords.longitude;
           mapZoom = 12;
           console.log("loc: " + mapCenterLat + ", " + mapCenterLon);
           map.setView(new L.LatLng(mapCenterLat, mapCenterLon), mapZoom);
		}, function (err) {
           console.log("Could not get your location:" + err);
        }, { enableHighAccuracy: false }); 
    }

    var osmUrl = 'http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg',
        osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: "Map data &copy; OpenStreetMap contributors"}),
        map = new L.Map('map', {layers: [osm], center: new L.LatLng(mapCenterLat, mapCenterLon), zoom: mapZoom});

    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    var drawControl = new L.Control.Draw({
        draw: {
            polyline: false,
            polygon: false,
            circle: false,
            marker: false
        },
        edit: false 
    });

    map.addControl(drawControl);

    // Only allow one layer at a time
    map.on('draw:drawstart', function (e) {
        if (typeof currentLayer !== "undefined") {
            drawnItems.removeLayer(currentLayer);
        }
    });

    map.on('draw:created', function (e) {
        var sw_bounds, ne_bounds;

        currentLayer = e.layer;
        sw_bounds = currentLayer.getBounds().getSouthWest();
        ne_bounds = currentLayer.getBounds().getNorthEast();
        currentBounds = "'" + sw_bounds.lat + "," + sw_bounds.lng + "," + ne_bounds.lat + "," + ne_bounds.lng + "'";
        $("#map").attr("latlon", currentBounds);

        drawnItems.addLayer(currentLayer);
    });
});
