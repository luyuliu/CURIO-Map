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
    if (xcurrentLayerID==$("#name-input").val() || $("#name-input").val()=="")
    {
      document.getElementById('fileInfoList').innerHTML ='<ul style="color:red">' +"Please re/specify layer's name."+'</ul>'
    }
    else{
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
    eval(xcurrentLayerID +"JSON = JSON.parse("+xcurrentLayerID +"JSON);")
  } catch (e) {
    document.getElementById('fileInfoList').innerHTML ='<ul style="color:red">' +"Cannot parse JSON string."+'</ul>'
    return false;
  }

  xlayerID = $("#name-input").val();
  for (var i = 0; i < fullLayerFlags.layerFlags.length; i++) {
    if (fullLayerFlags.layerFlags[i].layerID == xlayerID) {
      document.getElementById('fileInfoList').innerHTML ='<ul style="color:red">' +"Please use another name."+'</ul>'
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
    document.getElementById('fileInfoList').innerHTML ='<ul style="color:red">' +"Please finish the input."+'</ul>'
    return false;
  }

  if (!flagList[xlayerID]) {
    fullLayerFlags.pushNewItems(new LayerFlag(xlayerID, true, layerType, 3, dataType, false, extentType, afcolor, symbolType, xlayerID, null, null));
    addLayerHandle(xlayerID, true, dataType, false, symbolType, false, afcolor)
  } else {
    document.getElementById('fileInfoList').innerHTML ='<ul style="color:red">' +"Already added this layer."+'</ul>'
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
$("#tutorial-btn").click(function () {
  tour.init();
  tour.restart(true)
});

$("#addnew-tutorial-btn").click(function () {
  atour.init();
  atour.restart(true)
});
