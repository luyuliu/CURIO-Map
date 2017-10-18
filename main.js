/* *****************************************************************
 *
 *   Comprehensive Map Gallery using leaflet - main javascript
 *
 *   Author: Luyu Liu 
 *   Contact: liu.6544@osu.edu
 *   Update Date:2017.9.30
 *
 * *************************************************************** */

//------------------------------------map & basemap layers------------------------------------
var baseLayer = L.esri.basemapLayer('Topographic')
var theaterSearch = []
map = L.map("map", {
  zoom: 13,
  center: [39.98, -83],
  layers: [baseLayer],
  zoomControl: false,
  attributionControl: false,
  maxZoom: 18
});

groupedOverlays = {} //dummy parameters
map.createPane('basemapPane');
map.getPane('basemapPane').style.zIndex = 100;
map.getPane('popupPane').style.zIndex=700;

//------------------------------------symbol layers------------------------------------
/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};
highlight.addTo(map)

var e=null;



//------------------------------------signals & flags------------------------------------
//layer flag
var flagList=new Array();//the status of each layer. 1 means simple layer (without a modal), 2 means simple layer with a modal.
var POIFlagList=new Array();// the list of layer with features to demonstrate in the POI list
var mapFlagList=new Array();//the list of each maps. In accord with the buttons.

baseLayerID = "esriTopo";

//var listofZindex=new Array();

//------------------------------------attribution control------------------------------------
var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'><a href='http://cura.osu.edu' target='_blank'>CURA</a> | <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ' target='_blank'>Luyu Liu</a> | <a href='http://bryanmcbride.com' target='_blank'>Bootleaf</a></span>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

//------------------------------------Sortable list------------------------------------
// List with handle
//include onsort eventlistener and handle
var sortable = Sortable.create(layerList, {
  handle: '.glyphicon-move',
  animation: 150,
  scroll: true,
  scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
  scrollSpeed: 10,
  onEnd: function (e) {
    sortLayerHandle(e)
  }
});


$(document).ready(function(){
  $('.dropdown-submenu a.test').on("click", function(e){
    $(this).next('ul').toggle();
    e.stopPropagation();
    e.preventDefault();
  });
});