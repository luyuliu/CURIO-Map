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
var baseLayer = L.esri.basemapLayer('Topographic');

map = L.map("map", {
  zoom: 13,
  center: [39.98, -83],
  layers: [baseLayer],
  zoomControl: false,
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
  constructor(layerID, isSimpleLayer, layerType, featureType, dataType, URL, extentType, color, icon, layerName, left, right) {
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
    this._left = left;
    this._right = right;
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
  get left() {
    return this._left;
  }
  get right() {
    return this._right;
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
        return "#F79D17" //red
        break;

      case "S":
        return "#88A6E8" //blue
        break;

      case "E":
        return "#5EB062" //green
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
  dataType: 'JSON',
  success: function (data) {
    $.ajax({
      url: "https://luyuliu.github.io/CURIO-Map/data/metadata.json",
      type: 'GET',
      dataType: 'JSON',
      success: function (metadata) {
        for (var i in data) {
          fullLayerFlags.pushNewItems(new LayerFlag(data[i].layerID, (data[i].isSimpleLayer == 'TRUE'), data[i].layerType, parseInt(data[i].featureType), parseInt(data[i].dataType), data[i].URL, parseInt(data[i].extentType), data[i].color, data[i].icon, data[i].layerName, metadata[i].left, metadata[i].right));
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


        //------------------------------------Tutorial------------------------------------
        /*tour = new Tour({
          backdrop:true,
          backdropContainer:"body",
          steps: [{
              element: "#about-btn",
              title: "Welcome to CURIO Map gallery!",
              content: "Thank you for using CURIO map gallery! Click the title banner to see more detail of the map gallery!",
              backdrop: true
            },
            {
              element: "#sidebar-hide-btn",
              title: "Map controls I",
              content: "The left sidebar is the map controls. You can hide the menu by clicking the button and unfold it by clicking the floating button! Give it a try!",
              backdrop: true
            },
            {
              element: "#map-adm-title",
              title: "Map controls II",
              content: "The sidebar contains 3 parts, each of which can be fold and unfold by clicking on the title.",
              onNext: function (tour) {
                document.getElementById("collapseOne0").setAttribute("class", "panel-collapse collapse in")
              }
            },
            {
              element: "#layer-setting",
              title: "Layer Setting",
              content: '"Layer Setting" menu has three functions.</br>1. Change the base map </br>2. Uncheck all the layer selected in the Layer Control </br>3. Add more custom Geojson layers.'
            },
            {
              element: "#layer-sorting",
              title: "Layer Sorting",
              content: '"Layer Sorting" menu also has three sorting functions to sort the layers in the "Layer Control" list as well as the z-index in the map.</br>1. Alphabetical sorting;</br>2. Categories sorting, which will sort the layers according to Transportation (orange), Social (blue), and Environment (green) category;</br>3. GIS sorting, which will sort the layers based on their geometry dimension as in points (0-dimension) and polylines (1-dimension) and polygons (2-dimension).'
            },
            {
              element: "#emergency-list-item",
              title: "Layer Control I",
              content: "This panel contains multiple layers. For each layer, check the checkbox to add the layer to the map, and click on the title of each layer to see the metadata."
            },
            {
              element: "#emergency-list-item",
              title: "Layer Control II",
              content: "The sequence of the layers in this list is also the sequence of z-index of each layer. Drag the handle to move and change the z-index.<br/><br/>Click on the expanding arrow to see more functionalities."
            },
            {
              element: "#emergency-list-item",
              title: "Layer Control III",
              content: '1. Click on the "Legend" button to expand the legend of this layer;<br/>2. Click on the "Upmost" button to move this layer to the top of the list;</br>3. Click on the "Zoomto" button to zoom the map to the extent of the layer;</br>4. Drag the slider to change the opacity of the layer.</br></br>So give it try!',
              onNext: function (tour) {
                document.getElementById("collapseOne0").setAttribute("class", "panel-collapse collapse in")
              }
            },
            {
              element: "#group-button",
              title: "Layer Control IV",
              content: 'Check the "Pin checked" checkbox to pin the checked layers always to the top.'
            },
            {
              element: "#headingOne2",
              title: "POI List I",
              content: 'POI List shows the corresponding information of certain layers\'s point of interests in the current map extent.</br></br>Again, feel free to hide the "Layer Control" menu by clicking the title!'
            },
            {
              element: "#headingOne2",
              title: "POI List II",
              content: 'Type in the "Filter" to search and query, and click sort to sort the result and list.</br></br>If you want to zoom to the POI in the list, just simply click it!',
              onNext: function (tour) {
                document.getElementById("collapseOne0").setAttribute("class", "panel-collapse collapse in")
              }
            },
            {
              element: "#showclosest-button",
              title: "POI List III",
              content: '</br> Uncheck "Always show" checkbox to hide the POI list at higher zoom levels, which will influence map\'s performance, while checking the box will result in showing the POI list at any zoom levels.</br>'
            },
            {
              element: "#tutorial-btn",
              title: "Thank you!",
              placement: "left",
              content: 'Please feel free to explore! If you want to see the tutorial again, please click me anytime :)'
            },
          ]
        });


        atour = new Tour({
          steps: [{
              element: "#addnew-tutorial-btn",
              title: "Add your own layer in CURIO gallery!",
              placement: "right",
              content: "This is the custom layer adding panel. Make sure your Geojson is valid and enjoy! The system will present the Geojson on the map and the property information in popups."
            },
            {
              element: "#name-input",
              title: "Layer name",
              placement: "left",
              content: "Please make sure every layer has a unique name."
            },
            {
              element: "#layertype-input",
              title: "Layer type",
              placement: "left",
              content: "The category this layer belongs to."
            },
            {
              element: "#datatype-input",
              title: "Data type",
              placement: "left",
              content: "The geometry type of this layer."
            },
            {
              element: "#symbol-input",
              title: "Symbology for points",
              placement: "left",
              content: "This option only applys to points layers. The custom layer supports Awesome fonts icons."
            },
            {
              element: "#color-palette",
              title: "Color",
              placement: "left",
              content: "Select color for the layer."
            },
            {
              element: "#drop_zone",
              title: "File input",
              placement: "left",
              content: "Drag the geojson file to the rectangle area."
            },
            {
              element: "#confirm-btn",
              title: "File input",
              placement: "right",
              content: "Add this layer to the Layer Control list and enjoy!"
            }
          ]

        })*/
      }
    })
  }
})

var flagList = new Array(); //the status of each layer. 1 means simple layer (without a modal), 2 means simple layer with a modal.
var POIFlagList = new Array(); // the list of layer with features to demonstrate in the POI listconsole.log(fullLayerFlags)
var isPined = false;
var isLeveled = false;
var isCustomLayerAdded = false;

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



//----------------------------------geocoding plugin--------------------------------------------
var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider();
var searchControl = L.esri.Geocoding.geosearch({ position: "topright", provider: arcgisOnline }).addTo(map);



$(document).ready(function () {
  $('.dropdown-submenu a.test').on("click", function (e) {
    $(this).next('ul').toggle();
    e.stopPropagation();
    e.preventDefault();
  });
});