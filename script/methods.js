/* ******************************************************
 *
 *   Comprehensive Map Gallery using leaflet - methods javascript
 *
 *   Author: Luyu Liu 
 *   Contact: liu.6544@osu.edu
 *   Update Date:2017.9.30
 *
 * ******************************************************* */
//------------------------------------methods------------------------------------

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}



function receiveJsonp(URL2,layerID){
	var ajax2 = $.ajax({url: URL2,
    dataType: 'jsonp',
	jsonpCallback: 'getjson',
    success: getjson});
	
  
  var geoJsonLayer = new L.GeoJSON(null,{style: function style(feature) {
		return {
			weight: 1,
			opacity: 1,
			color: 'brown',
			fill: false
		};
	},
	pane: layerID+"Pane"
	});

  function getjson(data) {
	geoJsonLayer.addData(data);
  }
  return geoJsonLayer;
}

function changeBasemap(basemap){
map.removeLayer(baseLayer);
baseLayer=L.esri.basemapLayer(basemap, pane="basemapPane");
map.addLayer(baseLayer);
}


function getLayerName(mapID){
	switch(mapID){
		case "bikeshr":
		mapName="Bike Sharing Stations";
		return mapName;
		break;
		
		case "air":
		mapName="Central Ohio Air Quality";
		return mapName;
		break;
		
		case "homeown":
		mapName="Home Ownership";
		return mapName;
		break;
		
		case "cota":
		mapName="COTA Ridership";
		return mapName;
		break;
		
		case "wshd":
		mapName="Watersheds";
		return mapName;
		break;
		
		case "eth":
		mapName="Ethnic Dot Density";
		return mapName;
		break;
		
		case "sdw":
		mapName="Sidewalk Inventory";
		return mapName;
		break;
		
		case "sewer":
		mapName="Sewer Overflow Discharges";
		return mapName;
		break;
		
		case "demo":
		mapName="Franklin County Demographics";
		return mapName;
		break;
		
		case "bikepath":
		mapName="Bike Paths in Central Ohio";
		return mapName;
		break;
		
		case "water":
		mapName="Water Pollution";
		return mapName;
		break;
		
		case "gas":
		mapName="Columbus Gas Prices";
		return mapName;
		break;
		
		case "trans":
		mapName="OSU Campus Transportation";
		return mapName;
		break;
		
		case "tree":
		mapName="Columbus Trees";
		return mapName;
		break;
		
		case "ohio":
		mapName="Ohio";
		return mapName;
		break;
		
		
		default:
		return mapID
			alert("new layer")
		break;
		
	}
	
	
}

//addLayerHandle: when add button is pushed, this method is fired.
//Include: add items and their eventlisteners, remove eventlisteners
//for toggle eventlistener, it's in app.js->Sortable.create()
function addLayerHandle(layerID){
	//create pane for each layer, so that adjusting zindex is possible. Pane is a DOM so avoid use same name as layer.
	var layerPaneID=layerID+"Pane";
	if (!map.getPane(layerPaneID))
{
	map.createPane(layerPaneID);
	}
	
	map.getPane(layerPaneID).style.zIndex=currentZindex;
	//listofZindex[layerID]=currentZindex;
	listofLayerID.push(layerID);
	//listofZindex.push(currentZindex)
	currentZindex++;
	
	//add layer to the map by layerID
	addingLayer(layerID);
  //add list-item to the layers list, id=layerList
  //include a delete button, a icon, a slider (basically)
  var neodiv=document.createElement('div');
  neodiv.innerHTML="<div class=\"list-group-item\" id=\""+
  layerID+"-listItem"+
  "\">"+
      "<span class=\"glyphicon glyphicon-move\" aria-hidden=\"true\"></span>"+"&nbsp&nbsp"+
      getLayerName(layerID)+"<a id=\""+layerID+"-delete-btn\" class=\"btn btn-danger btn-delete-item btn-xs pull-right\">Delete</a>"+
	"<input id=\""+
	layerID+
	"-slider\"type=\"range\" value=\"100\">"+
	"</div>";
	document.getElementById("layerList").prepend(neodiv);
   //$("#"+layerID+"-listItem").hide().appendTo("#layerList").show(200);
   //console.log("#"+layerID+"-listItem")
  //-----slider------
$('#'+layerID+"-slider").rangeslider({
    polyfill: true,
});

var selector="#"+layerID+"-slider"
	
	var currentLayer=eval(layerID+"Layer");
	//opacity slider eventlistener
	
		$(document).on('input',selector,function(e){
		map.getPane(layerPaneID).style.opacity=(e.currentTarget.value/100);
	}
		)
	
	//delete button eventlistener (also remove the corresponding zindex in listofZindex)
	$('#'+layerID+"-delete-btn").click(function() {
		eval(layerID+"Added=false")
		$("#"+layerID+"-listItem").animate({
		height:"0px"
  }, 100, function() {
	  document.getElementById(layerID+"-listItem").parentElement.remove(); 
  });
			
		map.removeLayer(eval(layerID+"Layer"));
		var indexofRemoveItem=listofLayerID.indexOf(layerID);
		listofLayerID.splice(indexofRemoveItem,1);
		
		
	})
	
}

//sort layer handle
  function sortLayerHandle(e){
	  
	
	var sortList=sortable.toArray();
	var baseZindex=800;
	for(var i=0;i<sortList.length;i++)
	{
		currentLayerID=document.getElementById("layerList").children[i].children[0].id.substring(0,document.getElementById("layerList").children[i].children[0].id.indexOf("-"));
		map.getPane(currentLayerID+"Pane").style.zIndex=baseZindex-i;
	}
	
	  
	  
	  
  }

function addingLayer(layerID){///////////////must add the layer to the corresponding pane! &&&& must adjust flag status
	switch(layerID){
		case "tree":
		treeLayer =  L.esri.tiledMapLayer({
    url: 'http://geog-cura-gis.asc.ohio-state.edu/arcgis/rest/services/CURIO/CBUSTreesByDiameter/MapServer',
pane: layerID+'Pane'}
	);
  map.addLayer(treeLayer);
  treeAdded=true;
  break;
		
		
		case "ohio":
		//jsonpdata receive
  Jsonp_URL="http://localhost:8080/geoserver/POST/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=POST:county&maxFeatures=50&outputFormat=text%2Fjavascript&format_options=callback%3Agetjson"
  ohioLayer=receiveJsonp(Jsonp_URL,layerID);
  map.addLayer(ohioLayer);
  //ohioAdded=true;
  break;
		
  
		case "homeown":
			homeownLayer = L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> â€” Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
});
map.addLayer(homeownLayer);
homeownAdded=true;
break;
			
		
		case "sewer":
			sewerLayer = L.esri.featureLayer({url:'http://maps.columbus.gov/arcgis/rest/services/LegacyServices/SSOCSO/MapServer/0',
			pane:layerID+"Pane"});
			map.addLayer(sewerLayer);
			sewerAdded=true;
			break;
			
			
			
		case "bikepath_path":
			bikepath_pathLayer=L.esri.tiledMapLayer({
    url: 'http://arcgiswebadp1.morpc.org/webadaptor/rest/services/bikes/BikemapLevelOfComfort/MapServer',
		pane: layerID+'Pane'
  });
		map.addLayer(bikepath_pathLayer);
		bikepath_pathAdded=true;
		break;
		
		case "bikepath_green":
			bikepath_greenLayer = L.esri.featureLayer({
    url: 'http://arcgiswebadp1.morpc.org/webadaptor/rest/services/bikes/BikemapGreenways/MapServer/0',
		pane: layerID+'Pane'
  })
		map.addLayer(bikepath_greenLayer);
		bikepath_greenAdded=true;
		break;
			
		case "bikepath_heads":
			bikepath_headsLayer = L.esri.featureLayer({
    url: 'http://arcgiswebadp1.morpc.org/webadaptor/rest/services/bikes/Bikemap_Trailheads/MapServer/0',
		pane: layerID+'Pane'
  })
		map.addLayer(bikepath_headsLayer);
		bikepath_headsAdded=true;
		break;
			
			
			
			
		
	}
	
}

//using layerID to find the index of corresponding item in the listofLayerID and listofZindex. listofL and listofZ and list-item have same index system. And the sequence of list-item=Zindex-101
	
	
	
