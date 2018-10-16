////////////////////////////////////////////////////////////
const CONST_MAP_CLICK_MIN_ZOOM = 15;

// default map settings
// const CONST_MAP_DEFAULT_LONGITUDEX = -98.35;
// const CONST_MAP_DEFAULT_LATITUDEY  =  39.5;
const CONST_MAP_DEFAULT_LONGITUDEX = -95.99333;
const CONST_MAP_DEFAULT_LATITUDEY  =  36.14974;
const CONST_MAP_DEFAULT_ZOOM       =   14;


// OSM reverse geocoder
const CONST_OSM_URL             = "https://nominatim.openstreetmap.org/reverse";
const CONST_OSM_FORMAT          = "jsonv2";
const CONST_OSM_GEOCODE_ZOOM    = 18;   // 18 = building level; 
const CONST_OSM_ADDR_DETAILS    =  1;

const CONST_PIN_ANCHOR = new L.Point(48/2, 48);
const CONST_MARKER_ISS = new L.Icon({ iconUrl: "/assets/42598-rocket-icon.png", iconsize: [48, 48], iconAnchor: CONST_PIN_ANCHOR, popupAnchor: [0,-52] });

const CONST_MESSAGE_PROVIDER_CHECKBOX         = "At least one drive-time polygon provider must be selected."
const CONST_MESSAGE_INVALID_XY                = "Calculations are limited to within U.S. borders."
const CONST_MESSAGE_UNABLE_TO_REVERSE_GEOCODE = "Unable to reverse geocode location."

const CONST_MESSAGE_DISPLAY_TIME              = 10000
const CONST_MESSAGE_INVALID_XY_DISPLAY_TIME   = 3000

// definition of map layers; first layer is the default layer displayed
const CONST_MAP_LAYERS = [
    {
        // not https so can generate warnings due to mixed content
        // 2018-08-12 - https site currently has a NET::ERR_CERT_COMMON_NAME_INVALID
        name: "Grayscale OSM",
        url: "http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",      
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        minZoom:  5,
        maxZoom: 17
    },
    {
        name: "Esri OSM",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
        minZoom:  5,
        maxZoom: 17
    },
    {
        name: "Hydda OSM",
        url: "https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png",
        attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        minZoom:  5,
        maxZoom: 17
    },
    {
        name: "Basic OSM",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        minZoom:  5,
        maxZoom: 17
    },
    {
        name: "Esri World Imagery",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        minZoom:  5,
        maxZoom: 17
    }
];

const CONST_SLIDEOUT_DELAY_TIME = 500

const CONST_SLIDEOUT_HTML =    "<h1 style='color: #5e9ca0; text-align: center;'>MappyAsync</h1>\
                                <h3 style='color: #5e9ca0; text-align: left;'>What does it do?</h2>\
                                    <p>Given a polygon on the map, calculate demographics within the polygon.</p>\
                                    <p>Allow for the creation of isochrones (drive-time polygons)</p>\
                                </br>\
                                <hr size='3' align='center' color='#5e9ca0'>\
                                <h3 style='color: #5e9ca0; text-align: center;'>Settings</hr>\
                                <hr size='3' align='center' color='#5e9ca0'>\
                                    <center><p>Drive time polygon (minutes):</p></center>\
                                    <center>\
                                        <select id=minutes name=minutes onchange='minutesOnChange(this.value);'>\
                                            <option value='135' selected=selected>1-3-5  minutes</option>\
                                            <option value='358'>3-5-8  minutes</option>\
                                            <option value='5810'>5-8-10 minutes</option>\
                                            <option value='1015'>10-15 minutes</option>\
                                        </select>\
                                    </center>\
                                <hr size='3' align='center' color='#5e9ca0'>\
                                    <center><p>Drive-time polygon providers:</p></center>\
                                    <center><label><input type='checkbox' id='bing' checked='true' onchange='isChecked(id, this.checked);'> Bing Maps API</label></center>\
                                    <center><label><input type='checkbox' id='targomo' checked='true' onchange='isChecked(id, this.checked);'> Targomo API</label></center>\
                                <hr size='3' align='center' color='#5e9ca0'>\
                                    <center><label><input type='checkbox' id='clickAutoZoom' checked='true' onchange='isChecked(id, this.checked);'> Auto-zoom on map click</label></center>\
                                <hr size='3' align='center' color='#5e9ca0'>";
////////////////////////////////////////////////////////////

{/* <center><label><input type='checkbox' id='clickAutoZoom' checked='true' onchange='autoZoomChecked(this.checked);'> Auto-zoom on map click</label></center>\ */}