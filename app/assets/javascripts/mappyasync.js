// $(document).on('turbolinks:load', function() {
//     console.log("It works on each visit!")
// })


////////////////////////////////////////////////////////////
// prepare indexedDB 
var deleteIndexedDB = window.indexedDB.deleteDatabase("MappyAsync")

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

// prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
 
var openedDB = indexedDB.open("MappyAsync", 1);

openedDB.onupgradeneeded = function() {
    var db = openedDB.result;
    var store = db.createObjectStore("LocationStore", {keyPath: "id", autoIncrement: true});
}
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
// define base map layers
var grayscale = L.tileLayer("http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    minZoon: 5,
    maxZoom: 17
});

var esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}, detectRetina=true', {
    attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    minZoom: 5,
    maxZoom: 17
});

var osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    minZoom: 5,
    maxZoom: 17
});
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
// add location info to indexedDB
function addLocationToindexedDB(name, type, latlng) {
    var db = openedDB.result;
    var tx = db.transaction(["LocationStore"], "readwrite");
    var store = tx.objectStore("LocationStore", {keyPath: "id", autoIncrement: true});
    store.put({name: name, type: type, location: {lat: latlng.lat, lng:latlng.lng}})
}
////////////////////////////////////////////////////////////



var marker = L.marker()

$(document).ready(function() {

    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(function(location) {
    //         console.log(postion.coords.latitude + ", " + postion.coords.longitude);
    //     })
    // }

    ////////////////////////////////////////////////////////////
    // define map position, zoom and layer
    var map = L.map('map', {
        center: [39.5, -98.35],
        zoom: 5,
        layers: [grayscale]
    });
    ////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////
    // define base maps and layer control and add to map
    var baseMaps = {
        "Grayscale": grayscale,
        "Esri": esri,
        "OSM": osm
    }
    L.control.layers(baseMaps).addTo(map)
    ////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////
    // add scalebar
    L.control.scale({imperial: true, metric: false}).addTo(map)
    ////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////
    // add sidebar
    // credit: https://github.com/Turbo87/leaflet-sidebar
    //
    var sidebar = L.control.sidebar('sidebar', {
        position: 'left',
        closeButton: true,
        autoPan: false
    });
    
    map.addControl(sidebar);
    sidebar.setContent('<center><b>MappyAsync Settings</b></center>');
    ////////////////////////////////////////////////////////////




    var sidebarButtonCustomControl = L.Control.extend({
        options: {
            position: 'bottomright' 
        },
        
        onAdd: function(map) {

            var container = L.DomUtil.create('div', 'button-tool button-sidebar leaflet-bar leaflet-control leaflet-control-custom');
         
            container.onclick = function(){
                if (sidebar.isVisible()) {
                    sidebar.hide();
                } else {
                    setTimeout(function () {
                        sidebar.show();
                    }, 500);
                }
            }
            return container;
        }
    });
    map.addControl(new sidebarButtonCustomControl());



    var handButtonCustomControl = L.Control.extend({
        options: {
            position: 'bottomright' 
        },
        
        onAdd: function(map) {

            var container = L.DomUtil.create('div', 'button-tool button-hand leaflet-bar leaflet-control leaflet-control-custom');
         
            container.onclick = function(){
                if (sidebar.isVisible()) {
                    sidebar.hide();
                } else {
                    setTimeout(function () {
                        sidebar.show();
                    }, 500);
                }
            }
            return container;
        }
    });
    map.addControl(new handButtonCustomControl());




    var pointerButtonCustomControl = L.Control.extend({
        options: {
            position: 'bottomright' 
        },
        
        onAdd: function(map) {

            // var container = L.DomUtil.create('div', 'button-tool button-pointer leaflet-bar leaflet-control leaflet-control-custom');
            var container = L.DomUtil.create('div', 'button-tool button-pointer leaflet-bar leaflet-control-custom');
         
            container.onclick = function(){
                if (sidebar.isVisible()) {
                    sidebar.hide();
                } else {
                    setTimeout(function () {
                        sidebar.show();
                    }, 500);
                }
            }
            return container;
        }
    });
    map.addControl(new pointerButtonCustomControl());







    ////////////////////////////////////////////////////////////
    // add geocoder and plot marker
    //
    // credit:  https://github.com/perliedman/leaflet-control-geocoder
    // package: https://unpkg.com/leaflet-control-geocoder@1.5.8/
    //
    var geocoder = L.Control.geocoder({
            defaultMarkGeocode: false,
            collapsed: true,
            position: 'topright'
        }).on('markgeocode', function(e) { 
            mapGoToLatLng(e.geocode.center, e.geocode.name) 
        }).addTo(map)
    ////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////
    // add map click event
    map.on('click', function(event) {
        $.ajax({url: "/mapclick", data: { 'lat': event.latlng.lat, 'lng': event.latlng.lng}}
              ).success(function() { 
                mapGoToLatLng(event.latlng, "clicked location") 
        })
    });
    ////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////
    // handle x,y coordinates from a map click or geocode
    function mapGoToLatLng(latlng, name) {

        var mapZoom = map.getZoom();
        (mapZoom < 12) ? zoom = 12 : zoom = mapZoom

        map.flyTo(latlng, zoom)

        if (marker) map.removeLayer(marker);
        marker = new L.marker(latlng, { draggable: true, autopan: true })
        map.addLayer(marker);

        if (name == "clicked location") {

                const CONST_OSM                 = false; // GOOGLE if false

                const CONST_OSM_URL             = "https://nominatim.openstreetmap.org/reverse"
                const CONST_OSM_FORMAT          = "jsonv2"
                const CONST_OSM_ZOOM            = 18
                const CONST_OSM_ADDR_DETAILS    = 1

                const CONST_GOOGLE_URL          = "https://maps.googleapis.com/maps/api/geocode/json"
                const CONST_GOOGLE_KEY          = "AIzaSyCOt29qPo0EJgvO57L_ci4-XSwqSWNQgFE"
                
                var params

                if (CONST_OSM) {
                    url     = CONST_OSM_URL
                    params  = { format: CONST_OSM_FORMAT, lat: latlng.lat, lon: latlng.lng, zoom: CONST_OSM_ZOOM, addressdetails: CONST_OSM_ADDR_DETAILS }
                } else {
                    url     = CONST_GOOGLE_URL
                    params  = { latlng: latlng.lat + ',' + latlng.lng, key: CONST_GOOGLE_KEY }
                }
console.log(url)
                $.ajax({ type: "GET", url: url, data: params}).success(function(response) {
                    if (CONST_OSM && !response.error) {
                        marker.bindPopup(response.display_name).openPopup();
                        addLocationToindexedDB(response.display_name, "click location", { lat: response.lat, lng: response.lon });
                    } else if (response.status == "OK") {
                        marker.bindPopup(response.results[0]["formatted_address"]).openPopup();
                        addLocationToindexedDB(response.results[0]["formatted_address"], "click location", latlng);
                    };
                });

        } else {
            marker.bindPopup(name).openPopup();
            addLocationToindexedDB(name, "geocoded location", latlng)
        }

        // CHECK ON THIS!!!  GMH
        marker.on('dragend', function(event) {
            mapGoToLatLng(event.target._latlng, "clicked location")
        });

    }
    ////////////////////////////////////////////////////////////




})

