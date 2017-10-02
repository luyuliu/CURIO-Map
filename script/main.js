/* ******************************************************
 *
 *   Comprehensive Map Gallery using leaflet - main javascript
 *
 *   Author: Luyu Liu 
 *   Contact: liu.6544@osu.edu
 *   Update Date:2017.9.30
 *
 * ******************************************************* */

//------------------------------------map & basemap layers------------------------------------
var baseLayer=L.esri.basemapLayer('Topographic')

  map = L.map("map", {
  zoom: 13,
  center: [39.98, -83],
  layers: [baseLayer],
  zoomControl: false,
  attributionControl: false,
  maxZoom: 18
});

  groupedOverlays={}//dummy parameters
  map.createPane('basemapPane');
  map.getPane('basemapPane').style.zIndex=100;
  
//------------------------------------signals & flags------------------------------------
//layer flag
var bikeshrAdded=false;
var airAdded=false;
var homeownAdded=false;
var cotaAdded=false;
var wshdAdded=false;
var ethAdded=false;
var sdwAdded=false;
var sewerAdded=false;
var demoAdded=false;
var bikepath_pathAdded=false;
var bikepath_greenAdded=false;
var bikepath_headsAdded=false;
var waterAdded=false;
var gasAdded=false;
var transAdded=false;
var treeAdded=false;
var ohioAdded=false;

//z-index
//basemap: z-index=100
var baseZindex=100;
var currentZindex=baseZindex+1;

  var listofLayerID=new Array();
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

//------------------------------------buttons------------------------------------

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

//------------------------------------add buttons------------------------------------
$("#tree-btn").click(function() {
  //tree data receive
  if(treeAdded==false)
  {
  xlayerID="tree";
  addLayerHandle(xlayerID);
  return false;
  }
  else
  {
	  alert("Already added this layer.")
	  return false;
  }
  
});


$("#ohio-btn").click(function() {
  //ohio data receive
  if(ohioAdded==false)
  {
  xlayerID="ohio";
  addLayerHandle(xlayerID);
  return false;
  }
  else
  {
	  alert("Already added this layer.")
	  return false;
  }
  
});

$("#bikepath-btn").click(function() {
  //bikepath data receive
	if(bikepath_pathAdded==true&&bikepath_greenAdded==true&&bikepath_headsAdded==true)
{
	alert("Already added this layer.")
	  return false;
}
  if(bikepath_pathAdded==false)
  {
  xlayerID="bikepath_path";
  addLayerHandle(xlayerID);}
  
  if(bikepath_greenAdded==false){
  xlayerID="bikepath_green";
  addLayerHandle(xlayerID);}
  
  if(bikepath_headsAdded==false){
  xlayerID="bikepath_heads";
  addLayerHandle(xlayerID);}
  
return false;
  
});

$("#sewer-btn").click(function() {
  //sewer data receive
  if(ohioAdded==false)
  {
  xlayerID="sewer";
  addLayerHandle(xlayerID);
  return false;
  }
  else
  {
	  alert("Already added this layer.")
	  return false;
  }
  
});

$("#homeown-btn").click(function() {
  //homeown data receive
  if(ohioAdded==false)
  {
  xlayerID="homeown";
  addLayerHandle(xlayerID);
  return false;
  }
  else
  {
	  alert("Already added this layer.")
	  return false;
  }
  
});

//------------------------------------basemap controls------------------------------------
$("#esriDarkGray").click(function(){changeBasemap("DarkGray")});
$("#esriTopo").click(function(){changeBasemap("Topographic")});
$("#esriImagery").click(function(){changeBasemap("Imagery")});
$("#esriGray").click(function(){changeBasemap("Gray")});
//------------------------------------Sortable list------------------------------------
// List with handle
//include onsort eventlistener and handle
var sortable=Sortable.create(layerList, {
  handle: '.glyphicon-move',
  animation: 150,
  scroll: true,
  scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
  scrollSpeed: 10,
onEnd: function(e){
	sortLayerHandle(e)
}});

