/* *****************************************************************
 *
 *   Comprehensive Map Gallery using leaflet - main javascript
 *
 *   Author: Luyu Liu 
 *   Contact: liu.6544@osu.edu
 *
 * *************************************************************** */

//------------------------------------map & basemap layers------------------------------------
var test;
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
class LayerFlag {
  constructor(layerID, isSimpleLayer, layerType, featureType, dataType, URL, extentType, color, icon, layerName) {
    this._layerID = layerID;
    this._isSimpleLayer = isSimpleLayer; //is simple layer? simple here is defined as layers which don't involve with POIlist
    this._layerType = layerType; //T: transportation E: Environment S: Social
    this._featureType = featureType; //1: points 2: lines 3: polygons
    this._dataType = dataType; //0: not appliable 1: json points 2: json polylines and polygons 3: esri.feature 4: esri.tile The main purpose of this list is to specify datatype when instantiate "zoomto" buttons
    this._URL = URL;
    this._extentType = extentType;
    this._color = color;
    this._icon = icon;
    this._layerName = layerName;
  }
  get layerID() {
    return this._layerID;
  }
  get isSimpleLayer() {
    return this._isSimpleLayer;
  }
  get layerType() {
    return this._layerType;
  }
  get featureType() {
    return this._featureType;
  }
  get layerName() {
    return getLayerName(this._layerID);
  }
  get layerUpperName() {
    return getLayerName(this._layerID).toUpperCase();
  }
  get dataType() {
    return this._dataType;
  }
  get URL() {
    return this._URL;
  }
  get extentType() {
    return this._extentType;
  }
  get color() {
    return this._color;
  }
  get icon() {
    return this._icon;
  }
  get layerName() {
    return this._layerName;
  }
}

class LayerFlagGroup {
  /*constructor(layerIDs,isSimpleLayers,layerTypes,featureTypes,dataTypes,URLs){
    var alayerFlag;
    
    for(var i in layerIDs){
      alayerFlag=new LayerFlag(layerIDs[i],isSimpleLayers[i],layerTypes[i],featureTypes[i],dataTypes[i],URLs[i]);
      this._layerFlags.push(alayerFlag);
    }
    }*/
  constructor() {
    this._layerFlags = new Array();
  }

  get layerFlags() {
    return this._layerFlags;
  }

  pushNewItems(layerFlag) {
    this._layerFlags.push(layerFlag)
  }

  getItemByIndex(i) {
    return this.layerFlags[i];
  }

  getItemByLayerID(layerID) {
    for (var i in this.layerFlags) {
      if (this.layerFlags[i].layerID == layerID) {
        return this.layerFlags[i];
      }
    }
  }

  getIndexByLayerID(layerID) {
    for (var i in this.layerFlags) {
      if (this.layerFlags[i].layerID == layerID) {
        return i;
      }
    }

  }

  getFeatureTypeByLayerID(layerID) {
    return this.getItemByLayerID(layerID).featureType;
  }

  getURLByLayerID(layerID) {
    return this.getItemByLayerID(layerID).URL;
  }

  getDataTypeByLayerID(layerID) {
    return this.getItemByLayerID(layerID).dataType;
  }

  getBackgroundColor(layerID) {
    switch (this.getItemByLayerID(layerID).layerType) {
      case "T":
        return "#FFF4F4" //red
        break;

      case "S":
        return "#F4FFFF" //blue
        break;

      case "E":
        return "#F4FFF6" //green
        break;

      default:
        alert();
    }
  }

}

var fullLayerFlags = new LayerFlagGroup();

$.ajax({
  url: "https://luyuliu.github.io/CURIO-Map/data/inventory.json",
  type: 'GET',
  //async: false,
  dataType: 'JSON',
  success: function (data) {

    for (var i in data) {
      fullLayerFlags.pushNewItems(new LayerFlag(data[i].layerID, (data[i].isSimpleLayer == 'TRUE'), data[i].layerType, parseInt(data[i].featureType), parseInt(data[i].dataType), data[i].URL, parseInt(data[i].extentType),data[i].color,data[i].icon,data[i].layerName));
    }


    //------------------------------------layerList initialization------------------------------------
    for (var i in fullLayerFlags.layerFlags) {
      addLayerHandle(fullLayerFlags.layerFlags[i].layerID)
    }
    $("#layer-list").height($(window).height() / 2);

    new SimpleBar(document.getElementById('layer-list'))


    //------------------------------------Sortable list------------------------------------
    // List with handle
    //include onsort eventlistener and handle

    contentwrapper = document.getElementsByClassName("simplebar-content")[0]
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
  }
})

var flagList = new Array(); //the status of each layer. 1 means simple layer (without a modal), 2 means simple layer with a modal.
var POIFlagList = new Array(); // the list of layer with features to demonstrate in the POI listconsole.log(fullLayerFlags)
var isPined = false;

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






$(document).ready(function () {
  $('.dropdown-submenu a.test').on("click", function (e) {
    $(this).next('ul').toggle();
    e.stopPropagation();
    e.preventDefault();
  });
});