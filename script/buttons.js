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
//------------------------------------add buttons------------------------------------
//changebuttonstatus must be infront of mapflag chaanged
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




$("#morelayer-btn").click(function () {
  $("#more-modal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#confirm-btn").click(function () { //equal to clicking addLayer buttons.
  
  xlayerID = $("#name-input").val();
  URL = $("#url-input").val();
  dataType = $("#datatype-input").val();
  symbolType = $("#symbol-input").val();
  jsonp = "json";
  afcolor = $("#color-palette").val();
  if(xlayerID===undefined||URL===undefined)
  {
    alert("Please finish the input.")
    return false;
  }
  
  
  /*
   try {
     if (!flagList[xlayerID]) {
       addLayerHandle(xlayerID, dataType, URL, symbolType, jsonp, color);
     } else {
       alert("Already added this layer.")
     }
     sortLayerHandle(e)
     $("#more-modal").modal("hide");
     return false;
   } catch (err) {
     alert("Something went wrong. Adding layer failed.");
     try {
       deleteClickedHandle(xlayerID);
     } catch (err) {}
   }*/
  if (!flagList[xlayerID]) {
    addLayerHandle(xlayerID, dataType, URL, symbolType, jsonp, afcolor);
  } else {
    alert("Already added this layer.")
  }
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