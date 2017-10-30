/* ******************************************************
 *
 *   Comprehensive Map Gallery using leaflet - methods javascript
 *
 *   Author: Luyu Liu 
 *   Contact: liu.6544@osu.edu
 *
 * ******************************************************* */
function testFailedHandle() //error information
{
	document.getElementById("rickroll-box").innerHTML = "<div align='center'><h1>Sorry no such things...for now</h1></div> <div align='center'> <img src='img/rickroll.gif'> </div>"
	$("#rickroll-modal").modal("show");
}






if (!("ontouchstart" in window)) { //highlight
	$(document).on("mouseover", ".feature-row", function (e) {
		highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
	});
}

$(document).on("mouseout", ".feature-row", clearHighlight); //clear highlight when mouse out of feature-row

function clearHighlight() {
	highlight.clearLayers();
}

//------------------------------------sidebar------------------------------------
function animateSidebar() {
	$("#sidebar").animate({
		width: "toggle"
	}, 350, function () {
		map.invalidateSize();
	});
}

function sizeLayerControl() {
	$(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function sidebarClick(id, layerID) { //click on the sidebar handle
	markerClusters = eval(layerID + "Layer");
	var alayer = markerClusters.getLayer(id);
	map.setView([alayer.getLatLng().lat, alayer.getLatLng().lng], 17);
	alayer.fire("click");
	/* Hide sidebar and go to the map on small screens */
	if (document.body.clientWidth <= 767) {
		$("#sidebar").hide();
		map.invalidateSize();
	}
}

function syncSidebar() { //update the siderbar
	/* Empty sidebar features */
	$("#feature-list tbody").empty();
	/* Loop through stations layer and add only features which are in the map bounds */
	for (var i in POIFlagList) {
		var pictureURL = "img/" + i + ".png";
		var layerIDFullLayer = eval(i + "FullLayer");
		layerIDFullLayer.eachLayer(function (layer) {
			if (map.hasLayer(bikeshr_cogoLayer)) {
				if (map.getBounds().contains(layer.getLatLng())) {
					$("#feature-list tbody").append('<tr class="feature-row" layerID="' + i + '" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="' + pictureURL +
						'"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
				}
			}
		});
	}

}


//------------------------------------addhandle.js------------------------------------
function receiveJsonp(URL2, layerID, jsonp, acolor) {
	if (acolor === undefined && aweight === undefined) {
		acolor = "brown"
		aweight = 1
	}

	switch (jsonp) {
		case "JSON":
			var ajax2 = $.ajax({
				url: URL2,
				dataType: 'jsonp',
				jsonpCallback: 'getjson',
				success: getjson
			});
			var geoJsonLayer = new L.GeoJSON(null, {
				style: function style(feature) {
					return {
						weight: aweight,
						opacity: 1,
						color: acolor,
						fill: false
					};
				},
				pane: layerID + "Pane"
			});

			function getjson(data) {
				geoJsonLayer.addData(data);
			}
			return geoJsonLayer;
			break;

		default:
			$.getJSON(URL2, function (data) {
				var geoJsonLayer = new L.GeoJSON(data, {
					style: function style(feature) {
						return {
							weight: aweight,
							opacity: 1,
							color: acolor,
							fill: false
						};
					},
					pane: layerID + "Pane"
				});
				return geoJsonLayer;
			})
	}

}

function addingJsonPointsHandle(layerID, URL, symbolType, awcolor) {
	var anewicon = L.AwesomeMarkers.icon({
		icon: symbolType,
		markerColor: awcolor,
		shadow: null
	});
	anewicon.options.shadowSize = [0, 0]

	newLayer = L.geoJson(null, {
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {
				icon: anewicon,
				title: feature.properties.name,
				riseOnHover: true,
				pane: layerID + "Pane"
			});
		}
	})

	$.get(URL, function (data) {
		newLayer.addData(data);
	});

	return newLayer;
}

function getMapServerLegendDiv(layerID,url) {//return one map's legend

	var legendContent='<div id="'+layerID+'-legendcontent">'
	$.getJSON(url, function (data) {
		for (var i in data.layers["0"].legend) {
			labelContent = i.label;
			legendContent +=
				"<img src='data:image/png;base64," + i.imageData + "'>"
			"<span>" + labelContent + "</span>" + "<br>"
		}
	})
	legendContent+="</div>"
	return legendContent
}


//for homeown, mouse events
function onEachAdminFeature(feature, layer) {
	layer.on({
		mouseover: function (e) {
			thisLayerID = e.target.options.pane.substring(0, e.target.options.pane.indexOf("P"))
			var layer = e.target;
			layer.setStyle({
				weight: 5,
				color: '#999',
				fillOpacity: 0.7
			});


			//info.update(popupContent);

		},
		mouseout: function (e) {
			eval(thisLayerID + "Layer" + ".resetStyle(e.target);")
		},
		click: function (e) {
			// TODO: click
			feature = e.target.feature;
			console.log(e);
			var popupContent = "<h4>" + "Census Tract: " + feature.properties.TRACT + "</h4>" +
				"Housing Units: " + Number(feature.properties.HSE_UNITS) + "<br/>" +

				"Vacant Units: " + feature.properties.VACANT + "<br/>" +
				"Owner Occupied Units: " + feature.properties.OWNER_OCC + "<br/>" +
				"Rental Units: " + feature.properties.RENTER_OCC + "<br/>" +
				"Population/SQMI 2013: " + Math.floor(feature.properties.POP13_SQMI);

			var popup = L.popup().setLatLng([e.latlng.lat, e.latlng.lng]).setContent(popupContent).openOn(map);
		}
	});
}

//------------------------------------About 'Layer Settings' menu------------------------------------
function changeBasemap(basemap) { //change the icon of each options when changing basemap
	map.removeLayer(baseLayer);
	baseLayer = L.esri.basemapLayer(getLayerName(basemap), pane = "basemapPane");
	map.addLayer(baseLayer);
	document.getElementById(baseLayerID).innerHTML = document.getElementById(baseLayerID).innerHTML.substring(document.getElementById(baseLayerID).innerHTML.indexOf('/') + 4, document.getElementById(baseLayerID).innerHTML.length)
	console.log(basemap)
	document.getElementById(basemap).innerHTML = '<i class="fa fa-check" aria-hidden="true"></i> ' + document.getElementById(basemap).innerHTML;
	baseLayerID = basemap;
}

function changeButtonStatus(layerID) { //to change the icon in the buttons of each map
	try {
		if (mapFlagList[layerID] == null) {
			document.getElementById(layerID + "-btn").innerHTML = '<i class="fa fa-check" aria-hidden="true"></i> ' + document.getElementById(layerID + "-btn").innerHTML.substring(document.getElementById(layerID + "-btn").innerHTML.indexOf('/') + 4, document.getElementById(layerID + "-btn").innerHTML.length)
		} else {
			document.getElementById(layerID + "-btn").innerHTML = '<i class="fa fa-circle" aria-hidden="true"></i> ' + document.getElementById(layerID + "-btn").innerHTML.substring(document.getElementById(layerID + "-btn").innerHTML.indexOf('/') + 4, document.getElementById(layerID + "-btn").innerHTML.length)
		}
	} catch (err) {}

}

function getLayerName(layerID) { //from layerID to get full name of layer, the name 
	switch (layerID) {
		case "esriDarkGray":
			mapName = "DarkGray";
			return mapName;
			break;
		case "esriTopo":
			mapName = "Topographic";
			return mapName;
			break;
		case "esriImagery":
			mapName = "Imagery";
			return mapName;
			break;
		case "esriGray":
			mapName = "Gray";
			return mapName;
			break;
		case "bikeshr":
			mapName = "Bike Sharing Stations";
			return mapName;
			break;

		case "air":
			mapName = "Central Ohio Air Quality";
			return mapName;
			break;

		case "homeown":
			mapName = "Home Ownership";
			return mapName;
			break;

		case "cota":
			mapName = "COTA Ridership";
			return mapName;
			break;

		case "wshd":
			mapName = "Watersheds";
			return mapName;
			break;

		case "eth":
			mapName = "Ethnic Dot Density";
			return mapName;
			break;

		case "sdw":
			mapName = "Sidewalk Inventory";
			return mapName;
			break;

		case "sewer":
			mapName = "Sewer Overflow";
			return mapName;
			break;

		case "demo":
			mapName = "Franklin Demographics";
			return mapName;
			break;

		case "bikepath":
			mapName = "Bike Paths in Central Ohio";
			return mapName;
			break;

		case "water":
			mapName = "Water Pollution";
			return mapName;
			break;

		case "gas":
			mapName = "Columbus Gas Prices";
			return mapName;
			break;

		case "trans":
			mapName = "OSU Campus Transportation";
			return mapName;
			break;

		case "tree":
			mapName = "Columbus Trees";
			return mapName;
			break;

		case "ohio":
			mapName = "Ohio";
			return mapName;
			break;


		default:
			return layerID
			alert("new layer")
			break;

	}
}

function getColorx(val, grades, colors) {
	for (i = 0; i < grades.length; i++)
		if (val >= grades[i])
			return colors[i];
	return '#ffffff';
}



//addLayerHandle: when add button is pushed, this method is fired.
//Include: add items and their eventlisteners, remove eventlisteners
function addLayerHandle(layerID, dataType, URL, symbolType, jsonp, color) {
	//create pane for each layer, so that adjusting zindex is possible. Pane is a DOM so avoid use same name as layer.
	var layerPaneID = layerID + "Pane";
	if (!map.getPane(layerPaneID)) {
		map.createPane(layerPaneID);
	}
	if (symbolType === undefined) {
		symbolType = "cog";
	}
	if (color === undefined) {
		color = "#000000";
	}

	//add layer to the map by layerID
	addingLayer(layerID, dataType, URL, symbolType, jsonp, color);
	//add list-item to the layers list, id=layerList
	//include a delete button, a icon, a slider (basically)

	if (flagList[layerID] == 2) {
		POIFlagList[layerID] = true; //push layerID with features to demonstrate
	}
	syncSidebar(); //refresh POIList


	var neodiv = document.createElement('div');
	neodiv.innerHTML = "<div class=\"list-group-item\" id=\"" + layerID + "-listItem\">" + //list-group-item
		"<div class=\"panel-heading\" style=\"width:210px;height:20px;padding:0\">" + //wrapper

		//checkbox
		"<div class=\"checkbox checkbox-primary\" title=\"Click to show or hide the layer\" style=\"float:left ; margin: auto\">" +
		"<input type=\"checkbox\" id=\"" + layerID + "-checkbox" + "\" class=\"styled\" checked style=\"float:left;vertical-align: middle\">" +
		"<label>" +
		"<span style=\"float:left;vertical-align: middle\" class=\"glyphicon glyphicon-move\" title=\"Drag to change the sequence of layers\" aria-hidden=\"true\"></span>&nbsp" + //dragger
		"</label>" +
		"</div>" +
		//checkbox end


		//"<div class=\"panel-title\" style=\"float:left\">" +
		"<a style=\"float:left\" id=\"" + layerID + "-metadata" + "\" title=\"The metadata of the layer\" valign=\"top\" href=\"#\">" + getLayerName(layerID) + "</a>" + //metadata
		"<a class=\"accordion-toggle collapsed\" data-toggle=\"collapse\" data-parent=\"#accordion\" style=\"vertical-align: middle; float:right\" href=\"#" + layerID + "-controlcontainer" + "\" title=\"Click to show or hide the control box\">" +
		"</a>" +
		//"</div>" +
		"</div>" +

		"<div id=\"" + layerID + "-controlcontainer" + "\" class=\"panel-collapse collapse\" title=\"Click to open the legend\">" + //control wrapper
		"<div class=\"panel-body\" style=\"width:210px;padding:0px;margin:0px\">" + //wrapper

		'<b id="' + layerID + '-legend' + '" class="fa fa-info-circle" aria-hidden="true"></b>' +


		"<a id=\"" + layerID + "-delete-btn\" class=\"btn btn-danger btn-delete-item btn-xs pull-right\" title=\"Click to delete the layer\">Delete</a>" + //delete button
		"<input id=\"" + //slider
		layerID +
		"-slider\"type=\"range\" value=\"100\" title=\"Drag to adjust the opacity of the layer\">" +
		"</div>" +
		"</div>" +
		"</div>"
	document.getElementById("layerList").prepend(neodiv);

	$("#" + layerID + "-metadata").click(function () { //metadata
		$("#meta-modal").modal("show");
		$(".navbar-collapse.in").collapse("hide");
		return false;
	});

	$("#" + layerID + "-legend").click(function () { //legend
		$("#meta-modal").modal("show");
		$(".navbar-collapse.in").collapse("hide");
		return false;
	});



	//-----slider------
	$('#' + layerID + "-slider").rangeslider({
		polyfill: true,
	});

	$('#' + layerID + "-checkbox").change(function () {
		if ($(this).prop('checked')) {
			map.getPane(layerID + "Pane").style.opacity = 1;
			$('#' + layerID + "-slider").val(100).change();
		} else {
			map.getPane(layerID + "Pane").style.opacity = 0;
			$('#' + layerID + "-slider").val(0).change();
		}
	});

	var selector = "#" + layerID + "-slider"

	var currentLayer = eval(layerID + "Layer");
	//opacity slider eventlistener

	$(document).on('input', selector, function (e) {
		map.getPane(layerPaneID).style.opacity = (e.currentTarget.value / 100);
		if (e.currentTarget.value == 0) {
			document.getElementById(layerID + "-checkbox").checked = false;

		}
		if (e.currentTarget.value != 0 && !$(this).prop('checked')) {

			document.getElementById(layerID + "-checkbox").checked = true;

		}

	})

	//delete button eventlistener (also remove the corresponding zindex in listofZindex)
	$('#' + layerID + "-delete-btn").click(function () {
		deleteClickedHandle(layerID);
	})



}

//sort layer handle
function sortLayerHandle(e) {


	var sortList = sortable.toArray();
	var baseZindex = 300;
	for (var i = 0; i < sortList.length; i++) {
		currentLayerID = document.getElementById("layerList").children[i].children[0].id.substring(0, document.getElementById("layerList").children[i].children[0].id.indexOf("-"));
		map.getPane(currentLayerID + "Pane").style.zIndex = baseZindex - i;
	}
}

//get layer's mapID
function getLayerParent(layerID) { //very ugly codes...
	switch (layerID) {
		case "bikeshr_cogo":
			return "bikeshr";
			break;
		case "bikeshr_zgst":
			return "bikeshr";
			break;
		case "bikepath_heads":
			return "bikepath";
			break;
		case "bikepath_green":
			return "bikepath";
			break;
		case "bikepath_path":
			return "bikepath";
			break;

		default:
			return layerID;
	}
}

//get map's layerID
function getLayerChildren(layerID) { //very ugly codes...
	switch (layerID) {
		case "bikeshr":
			return ["bikeshr_cogo", "bikeshr_zgst"];
		case "bikepath":
			return ["bikepath_heads", "bikepath_green", "bikepath_path"]

		default:
			return [layerID]


	}
}

//deletebutton of each layer handle
function deleteClickedHandle(layerID) {

	$("#" + layerID + "-metadata").off("click");
	$("#" + layerID + "-legend").off("click");
	$('#' + layerID + "-slider").off("rangeslider");
	$('#' + layerID + "-checkbox").off("change");
	$("#" + layerID + "-slider").off("input"); //turn off the eventhandler


	$("#" + layerID + "-listItem").animate({
		height: "0px"
	}, 100, function () {
		document.getElementById(layerID + "-listItem").parentElement.remove();
	});

	//map.removeLayer(eval(layerID + "Layer"));
	eval('map.removeLayer(' + layerID + 'Layer);')


	var Sibling = getLayerChildren(getLayerParent(layerID));


	delete flagList[layerID];
	if (POIFlagList[layerID]) {
		delete POIFlagList[layerID];
	}


	//adjust the status of buttons
	if (Sibling.length == 1) {
		changeButtonStatus(getLayerParent(layerID));
		delete mapFlagList[getLayerParent(layerID)];
		return false;
	}
	for (var otherSibling in Sibling) {
		console.log(otherSibling)
		console.log(Sibling[otherSibling])
		if (flagList[Sibling[otherSibling]]) {
			break;
		}
		if (Sibling[otherSibling] == Sibling[Sibling.length - 1]) {
			changeButtonStatus(getLayerParent(layerID));
			delete mapFlagList[getLayerParent(layerID)];
		}
	}
	syncSidebar();
}