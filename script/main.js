/* *****************************************************************
 *
 *   Comprehensive Map Gallery using leaflet - main javascript
 *
 *   Author: Luyu Liu 
 *   Contact: liu.6544@osu.edu
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
map.getPane('popupPane').style.zIndex = 700;

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

var e = null;

//------------------------------------legend------------------------------------
/*var legend = L.control({
  position: 'topright'
})
legend.onAdd=function(map){
  var div = L.DomUtil.create('div', 'info legend')
  return div;
}
legend.addTo(map)*/



//------------------------------------signals & flags------------------------------------
//layer flag
class LayerFlag{
  constructor(layerID,isSimpleLayer,layerType,featureType){
    this._layerID=layerID;
    this._isSimpleLayer=isSimpleLayer;
    this._layerType=layerType;
    this._featureType=featureType;
  }
  get layerID(){
    return this._layerID;
  }
  get isSimpleLayer(){
    return this._isSimpleLayer;
  }
  get layerType(){
    return this._layerType;
  }
  get featureType(){
    return this._featureType;
  }
  get layerName(){
    return getLayerName(this._layerID);
  }

}

class LayerFlagGroup{
  constructor(layerIDs,isSimpleLayers,layerTypes,featureTypes){
    var alayerFlag;
    this._layerFlags=[];
    for(var i in layerIDs){
      alayerFlag=new LayerFlag(layerIDs[i],isSimpleLayers[i],layerTypes[i],featureTypes[i]);
      this._layerFlags.push(alayerFlag);
    }
    }

    get layerFlags(){
      return this._layerFlags;
    }

    getItemByIndex(i){
      return this.layerFlags[i];
    }
    static compareName(a,b){
      var textA = a.layerID.toUpperCase();
      var textB = b.layerID.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    }

  }

var flagList = new Array(); //the status of each layer. 1 means simple layer (without a modal), 2 means simple layer with a modal.
var POIFlagList = new Array(); // the list of layer with features to demonstrate in the POI list
var mapFlagList = new Array(); //the list of each maps. In accord with the buttons.
var fullLayerIDsList=new Array('bikeshr_cogo', 'bikeshr_zgst', 'air_coal', 'air_ngp', 'homeown', 'cota', 'wshd_cso', 'wshd_wshd', 'eth_eth', 'eth_asian', 'eth_his', 'eth_black', 'eth_white', 'sdw_sdw', 'sdw_nsdw', 'sewer', 'demo', 'bikepath_path', 'bikepath_green', 'bikepath_heads', 'water_npdes', 'water_intakes', 'water_buffers', 'gas', 'trans_cabsN', 'trans_cabsS', 'trans_cabsNE', 'trans_cabsER', 'trans_cabsBV', 'trans_parkingC', 'trans_parkingB', 'trans_parkingA', 'trans_parkingG', 'tree')
var fullIsSimpleLayersList=new Array(false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true)
var fullFeatureType=new Array(1,1,1,1,3,3,1,2,1,1,1,1,1,2,2,1,3,2,2,1,1,1,3,1,2,2,2,2,2,2,2,2,2,3);
var fullLayerTypesList=new Array('T','T','E','E','S','T','E','E','S','S','S','S','S','T','T','E','S','T','T','T','E','E','E','S','T','T','T','T','T','T','T','T','T','E')
var fullLayerFlags=new LayerFlagGroup(fullLayerIDsList,fullIsSimpleLayersList,fullLayerTypesList,fullFeatureType);

//---------------------------------------------Initialization----------------------------------------

baseLayerID = "esriTopo";

//var listofZindex=new Array();

//------------------------------------attribution control------------------------------------
var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'><a href='http://cura.osu.edu' target='_blank'>CURA</a> | <a href='https://github.com/luyuliu' target='_blank'>Luyu Liu</a> | <a href='http://bryanmcbride.com' target='_blank'>Bootleaf</a></span>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

//------------------------------------layerList initialization------------------------------------
$(function(){
  for(var i in fullLayerIDsList){
    addLayerHandle(fullLayerIDsList[i])
    }
  $("#layer-list").height($(window).height()/2);

  new SimpleBar(document.getElementById('layer-list'))
  })

//------------------------------------Sortable list------------------------------------
// List with handle
//include onsort eventlistener and handle
$(document).ready(function () {
contentwrapper=document.getElementsByClassName("simplebar-content")[0]
asortable = Sortable.create(contentwrapper, {
  handle: '.glyphicon-move',
  animation: 150,
  scroll: true,
  scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
  scrollSpeed: 10,
  onEnd: function (e) {
    sortLayerHandle(e)
  }
});
})


$(document).ready(function () {
  $('.dropdown-submenu a.test').on("click", function (e) {
    $(this).next('ul').toggle();
    e.stopPropagation();
    e.preventDefault();
  });
});


