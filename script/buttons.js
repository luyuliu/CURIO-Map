/* ******************************************************
 *
 *   Comprehensive Map Gallery using leaflet - buttons javascript
 *
 *   Author: Luyu Liu 
 *   Contact: liu.6544@osu.edu
 *
 * ******************************************************* */
//------------------------------------other buttons------------------------------------

$("#about-btn").click(function () {
  $("#about-modal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#sidebar-hide-btn").click(function () {
  animateSidebar();
  $('.mini-submenu').fadeIn();
  return false;
});


$('.mini-submenu').on('click', function () {
  animateSidebar();
  $('.mini-submenu').hide();
})

$("#removeall-btn").click(function () {
  for (var layerID in flagList) {
    uncheckedHandle(layerID);
    document.getElementById(layerID + "-checkbox").checked = false;
  }
  return false;
});

$("#foldall-btn").click(function () {
  for (var aLayer = 0; aLayer < fullLayerFlags.layerFlags.length; aLayer++) {
    bblayerID = fullLayerFlags.layerFlags[aLayer].layerID;
    if ($("#" + bblayerID + "-controlcontainer").attr("class") != "panel-collapse collapse") {
      $("#" + bblayerID + "-toggle").trigger("click")
    }
  }
  return false;
});

$("#onlycheck-btn").click(function () {
  testFailedHandle();
  return false;
});

$("#test-btn").click(function () {
  testFailedHandle();
  return false;
});

$('#pin-checkbox').change(function () {
  if ($(this).prop('checked')) {
    isPined = true;
    reSortHandle();
  } else {
    isPined = false;
  }
});

$('#leveled-checkbox').change(function () {
  if ($(this).prop('checked')) {
    isLeveled = true;
    syncSidebar(isLeveled)
  } else {
    isLeveled = false;
    syncSidebar(isLeveled)
  }
});

//------------------------------------sorting buttons------------------------------------
/*$("#topchecked-btn").click(function () {
  var container = document.getElementsByClassName("simplebar-content")[0]
  var base36ToLayerIDList = [],
    layerListOrder = asortable.toArray(),
    currentItem,
    currentBase36Id;
  for (var i in container.children) {
    var xcurrentLayerID = document.getElementsByClassName("simplebar-content")[0].children[1].children[0].getAttribute("layerID")
    base36ToLayerIDList[layerListOrder[i]]=xcurrentLayerID
  }

  for (var j in flagList) {
    currentItem = document.getElementById(j + "-list-item").parentNode;
    currentBase36Id = generateBase36Id(currentItem);
    for (var i = 0; i < layerListOrder.length; i++) {
      if (currentBase36Id == layerListOrder[i]) {
        var tempId = layerListOrder[i];
        layerListOrder.splice(i, 1);
        layerListOrder.unshift(tempId);
        break;
      }
    }
  }
  asortable.sort(layerListOrder);
  sortLayerHandle(e)
  return false;
});*/

$("#alphabet-btn").click(function () {
  var condition = 'layerUpperName'; //in the defination of class 'LayerFlag'
  conditionalSortHandle(condition);
  if (isPined) {
    reSortHandle();
  }
});

$("#categorize-btn").click(function () {
  var condition = 'layerType'; //in the defination of class 'LayerFlag'
  conditionalSortHandle(condition);
  if (isPined) {
    reSortHandle();
  }
});

$("#gissorting-btn").click(function () {
  var condition = 'featureType'; //in the defination of class 'LayerFlag'
  conditionalSortHandle(condition);
  if (isPined) {
    reSortHandle();
  }
});

//------------------------------------add buttons------------------------------------
//changebuttonstatus must be infront of mapflag chaanged
/*
$("#tree-btn").click(function () {
  //tree data receive
  xlayerID = "tree";
  if (!flagList[xlayerID]) {
    addLayerHandle(xlayerID);
    changeButtonStatus(xlayerID)
    mapFlagList[xlayerID] = true;
  } else {
    alert("Already added this layer.")
  }
  sortLayerHandle(e)
  return false;

});


$("#ohio-btn").click(function () {
  //ohio data receive
  xlayerID = "ohio";
  if (!flagList[xlayerID]) {
    addLayerHandle(xlayerID);
    changeButtonStatus(xlayerID)
    mapFlagList[xlayerID] = true;
  } else {
    alert("Already added this layer.")
  }
  sortLayerHandle(e)
  return false;
});

$("#bikepath-btn").click(function () {
  //bikepath data receive

  if (flagList["bikepath_path"] && flagList["bikepath_green"] && flagList["bikepath_heads"]) {
    alert("Already added this layer.")
    return false;
  }

  if (!flagList["bikepath_path"]) {
    xlayerID = "bikepath_path";
    addLayerHandle(xlayerID);
  }

  if (!flagList["bikepath_green"]) {
    xlayerID = "bikepath_green";
    addLayerHandle(xlayerID);
  }

  if (!flagList["bikepath_heads"]) {
    xlayerID = "bikepath_heads";
    addLayerHandle(xlayerID);
  }
  sortLayerHandle(e)
  changeButtonStatus("bikepath")
  mapFlagList["bikepath"] = true;
  return false;

});

$("#sewer-btn").click(function () {
  //sewer data receive
  xlayerID = "sewer";
  if (!flagList[xlayerID]) {

    addLayerHandle(xlayerID);
    changeButtonStatus(xlayerID)
    mapFlagList[xlayerID] = true;
  } else {
    alert("Already added this layer.")
  }
  sortLayerHandle(e)
  return false;
});

$("#homeown-btn").click(function () {
  //homeown data receive
  xlayerID = "homeown";
  if (!flagList[xlayerID]) {

    addLayerHandle(xlayerID);
    changeButtonStatus("homeown")
    mapFlagList[xlayerID] = true;
  } else {
    alert("Already added this layer.")
  }
  sortLayerHandle(e)
  return false;
});

$("#bikeshr-btn").click(function () {
  //bikeshr data receive
  if (flagList["bikeshr_cogo"] && flagList["bikeshr_zgst"]) {
    alert("Already added this layer.")
    return false;
  }
  if (!flagList["bikeshr_cogo"]) {
    xlayerID = "bikeshr_cogo";
    addLayerHandle(xlayerID);
  }
  if (!flagList["bikeshr_zgst"]) {
    xlayerID = "bikeshr_zgst";
    addLayerHandle(xlayerID);
  }
  sortLayerHandle(e)
  changeButtonStatus("bikeshr")
  mapFlagList["bikeshr"] = true;


  return false;
});

$("#water-btn").click(function () {
  //water data receive
  if (flagList["water_npdes"] && flagList["water_intakes"] && flagList["water_buffers"]) {
    alert("Already added this layer.")
    return false;
  }
  if (!flagList["water_npdes"]) {
    xlayerID = "water_npdes";
    addLayerHandle(xlayerID,"GeoServer tiles","http://epagis1.oit.ohio.gov/arcgis/rest/services/WM/DSW/MapServer/1");
  }
  if (!flagList["water_intakes"]) {
    xlayerID = "water_intakes";
    addLayerHandle(xlayerID,"GeoServer tiles","http://epagis1.oit.ohio.gov/arcgis/rest/services/WM/DDAGW_WI/MapServer/0");
  }
  if (!flagList["water_buffers"]) {
    xlayerID = "water_buffers";
    addLayerHandle(xlayerID,"GeoServer tiles","http://geog-cura-gis.asc.ohio-state.edu/arcgis/rest/services/CURIO/IntakeBuffers/MapServer/1");
  }
  sortLayerHandle(e)
  changeButtonStatus("water")
  mapFlagList["water"] = true;


  return false;
});

*/


$("#morelayer-btn").click(function () {
  $("#fileInfoList").empty();
  $("#more-modal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

//drag-to-show handling
function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.
  //console.log(files)

  // files is a FileList of File objects. List some properties.
  var output = [];
  f = files[0]




  var fileReader = new FileReader();
  fileReader.onload = function (e) {
    if (xcurrentLayerID == $("#name-input").val() || $("#name-input").val() == "") {
      document.getElementById('fileInfoList').innerHTML = '<ul style="color:red">' + "Please re/specify layer's name." + '</ul>'
    } else {
      xcurrentLayerID = $("#name-input").val();
      eval(xcurrentLayerID + "JSON = fileReader.result;")
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
        f.size, ' bytes, last modified: ',
        f.lastModifiedDate.toLocaleDateString(), '</li>');
      document.getElementById('fileInfoList').innerHTML = '<ul>' + output.join('') + '</ul>';
    }
  }
  fileReader.readAsText(f);


}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var xcurrentLayerID = null;
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);

$("#confirm-btn").click(function () { //equal to clicking addLayer buttons.
  //console.log(localJSON)
  try {
    eval(xcurrentLayerID + "JSON = JSON.parse(" + xcurrentLayerID + "JSON);")
  } catch (e) {
    document.getElementById('fileInfoList').innerHTML = '<ul style="color:red">' + "Cannot parse JSON string." + '</ul>'
    return false;
  }

  xlayerID = $("#name-input").val();
  for (var i = 0; i < fullLayerFlags.layerFlags.length; i++) {
    if (fullLayerFlags.layerFlags[i].layerID == xlayerID) {
      document.getElementById('fileInfoList').innerHTML = '<ul style="color:red">' + "Please use another name." + '</ul>'
      return false;
    }
  }

  URL = null
  layerTypeText = $("#layertype-input").val();
  switch (layerTypeText) {
    case "Transportation":
      layerType = "T"
      break;
    case "Environment":
      layerType = "E"
      break;
    case "SocioEconomic":
      layerType = "S"
      break;
  }
  dataTypeText = $("#datatype-input").val();
  switch (dataTypeText) {
    case "Points":
      dataType = 1;
      extentType = 1;
      break;
    case "Polylines":
      dataType = 2;
      extentType = 1;
      break;
    case "Polygons":
      dataType = 6;
      extentType = 1;
      break;
  }
  symbolType = $("#symbol-input").val();
  afcolor = $("#color-palette").val();
  if (xlayerID === undefined || URL === undefined) {
    document.getElementById('fileInfoList').innerHTML = '<ul style="color:red">' + "Please finish the input." + '</ul>'
    return false;
  }

  if (!flagList[xlayerID]) {
    fullLayerFlags.pushNewItems(new LayerFlag(xlayerID, true, layerType, 3, dataType, false, extentType, afcolor, symbolType, xlayerID, null, null));
    addLayerHandle(xlayerID, true, dataType, false, symbolType, false, afcolor)
  } else {
    document.getElementById('fileInfoList').innerHTML = '<ul style="color:red">' + "Already added this layer." + '</ul>'
  }
  sortLayerHandle(e)
  $("#more-modal").modal("hide");
  new SimpleBar(document.getElementById('layer-list'))

  return false;
  /*} catch (err) {
    alert("Something went wrong. Adding layer failed.");
  }*/

  sortLayerHandle(e)
  $("#more-modal").modal("hide");
  return false;

});

//------------------------------------basemap controls------------------------------------
$("#esriDarkGray").click(function () {
  changeBasemap("esriDarkGray")
});
$("#esriTopo").click(function () {
  changeBasemap("esriTopo")
});
$("#esriImagery").click(function () {
  changeBasemap("esriImagery")
});
$("#esriGray").click(function () {
  changeBasemap("esriGray")
});

//------------------------------------tutorial button-------------------------------------
function tutorialHandle() {
  for (var zz = 0; zz < 19; zz++) {
    var item, intro;
    switch (zz) {
      case 0:
        item = "mapheader";
        intro = "Welcome to CURIO Map gallery! Thank you for using CURIO map gallery! Click the title banner to see more detail of the map gallery"
        break;
      case 1:
        item = "accordion1"
        intro = "The left sidebar is the map controls."
        break;
      case 2:
        item = "sidebar-hide-btn";
        intro = "You can hide the menu by clicking the button and unfold it by clicking the floating button."
        break;
      case 3:
        item = "map-adm-title"
        intro = "The sidebar contains 3 parts, each of which can be fold and unfold by clicking on the title."
        break;
      case 4:
        item = "layer-setting"
        intro = "'Layer Setting' menu has three functions.</br>1. Change the base map </br>2. Uncheck all the layer selected in the Layer Control </br>3. Fold all the panel in the 'Layer Control' list. </br>4. Add more custom Geojson layers."
        break;
      case 5:
        item = "layer-sorting"
        intro = "'Layer Sorting' menu also has three sorting functions to sort the layers in the 'Layer Control' list as well as the z-index in the map.</br>1. Alphabetical sorting;</br>2. Categories sorting, which will sort the layers according to Transportation (orange), Social (blue), and Environment (green) category;</br>3. GIS sorting, which will sort the layers based on their geometry dimension as in points (0-dimension) and polylines (1-dimension) and polygons (2-dimension)."
        break;
      case 6:
        item = "layer-control-panel"
        intro = "This panel contains multiple layers to display and overlay."
        break;
      case 7:
        item = "emergency-checkbox"
        intro = "For each layer, check/uncheck the checkbox to add/remove the layer to/from the map."
        break;
      case 8:
        item = "emergency-metadata"
        intro = "And click on the title of each layer to see the metadata."
        break;
      case 9:
        item = "emergency-list-item"
        intro = "The sequence of the layers in this list is also the sequence of z-index of each layer. Drag the handle to move and change the z-index.<br/><br/>Click on the expanding arrow to see more functions."
        break;
      case 10:
        item = "emergency-legend-btn"
        intro = "Click on the 'Legend' button to expand the legend of this layer. Legend can only be opened after the layer is added to the map."
        break;
      case 11:
        item = "emergency-upmost-btn"
        intro = "Click on the 'Upmost' button to move this layer to the top of the list as well as the z-index will be raised to the top."
        break;
      case 12:
        item = "emergency-zoomto-btn"
        intro = "Click on the 'Zoomto' button to zoom the map to the extent of the layer."
        break;
      case 13:
        item = "emergency-slider"
        intro = "Drag the slider to change the opacity of the layer."
        break;
      case 14:
        item = "group-button"
        intro = "Check the 'Auto group' checkbox to pin the checked layers to the top."
        break;
      case 15:
        item = "headingOne2"
        intro = "POI List shows the corresponding information of certain layers's point of interests in the current map extent.</br></br>Again, feel free to hide the 'Layer Control' menu by clicking the title!"
        break;
      case 16:
        item = "search-and-sort"
        intro = "Type in the 'Filter' to search and query, and click sort to sort the result and list.</br></br>If you want to zoom to the POI in the list, just simply click it!"
        break;
      case 17:
        item = "showclosest-button"
        intro = "Toggle 'Show less POI' slider to hide the POI list at higher zoom levels, which will influence map\'s performance, while checking the box will result in showing the POI list at any zoom levels."
        break;
      case 18:
        item = "tutorial-btn"
        intro = "Please feel free to explore! If you want to see the tutorial again, please click me anytime :)"
        break;
    }
    document.getElementById(item).setAttribute("data-step", (zz + 1).toString());
    document.getElementById(item).setAttribute("data-intro", intro);
    document.getElementById(item).setAttribute("data-position", "auto")
  }

    introJs().onchange(function (targetElement) {
      console.log(targetElement.getAttribute("data-step"));
      switch (targetElement.getAttribute("data-step")) {
        case "4":
          if ($("#collapseOne0").attr("class") != "panel-collapse collapse in") {
            $("#map-adm-title").trigger("click")
          }
          break;
        case "11":
          if ($("#emergency-controlcontainer").attr("class") != "panel-collapse collapse in") {
            $("#emergency-toggle").trigger("click");
          }
          if ($("#collapseOne1").attr("class") != "panel-collapse collapse in") {
            $("#layer-control-panel-inner").trigger("click")
          }
          break;
        case "12":
          if ($("#emergency-controlcontainer").attr("class") != "panel-collapse collapse in") {
            $("#emergency-toggle").trigger("click");
          }
          if ($("#collapseOne1").attr("class") != "panel-collapse collapse in") {
            $("#layer-control-panel-inner").trigger("click")
          }
          break;
        case "13":
          if ($("#emergency-controlcontainer").attr("class") != "panel-collapse collapse in") {
            $("#emergency-toggle").trigger("click");
          }
          if ($("#collapseOne1").attr("class") != "panel-collapse collapse in") {
            $("#layer-control-panel-inner").trigger("click")
          }
          break;
        case "15":
          if ($("#collapseOne0").attr("class") != "panel-collapse collapse in") {
            $("#map-adm-title").trigger("click")
          }
          if ($("#collapseOne1").attr("class") != "panel-collapse collapse") {
            $("#layer-control-panel-inner").trigger("click")
          }
          break;
        case "14":
          if ($("#emergency-controlcontainer").attr("class") != "panel-collapse collapse in") {
            $("#emergency-toggle").trigger("click");
          }
          if ($("#collapseOne1").attr("class") != "panel-collapse collapse in") {
            $("#layer-control-panel-inner").trigger("click")
          }
          break;
        case "16":
          if ($("#collapseOne1").attr("class") != "panel-collapse collapse") {
            $("#layer-control-panel-inner").trigger("click")
          }
          break;
        case "17":
          if ($("#collapseOne1").attr("class") != "panel-collapse collapse") {
            $("#layer-control-panel-inner").trigger("click")
          }
          break;
        case "18":
          if ($("#collapseOne0").attr("class") != "panel-collapse collapse in") {
            $("#map-adm-title").trigger("click")
          }
          break;
      }
    }).oncomplete(function () {
      console.log("Tutorial ends.")
      if ($("#collapseOne0").attr("class") != "panel-collapse collapse") {
        $("#map-adm-title").trigger("click")
      }
      if ($("#collapseOne1").attr("class") != "panel-collapse collapse in") {
        $("#layer-control-panel-inner").trigger("click")
      }
    }).onexit(function () {
      console.log("Tutorial ends.")
      if ($("#collapseOne0").attr("class") != "panel-collapse collapse") {
        $("#map-adm-title").trigger("click")
      }
      if ($("#collapseOne1").attr("class") != "panel-collapse collapse in") {
        $("#layer-control-panel-inner").trigger("click")
      }
    }).start();
}
$("#tutorial-btn").click(function () {
  tutorialHandle();
})
$("#tutorial-btn2").click(function () {
  tutorialHandle();
})








$("#addnew-tutorial-btn").click(function () {
  $('body').chardinJs({
    'attribute': 'chardin-intro',
    'method': 'start'
  })
});