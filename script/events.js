/* ******************************************************
 *
 *   Comprehensive Map Gallery using leaflet - events javascript
 *
 *   Author: Luyu Liu 
 *   Contact: liu.6544@osu.edu
 *
 * ******************************************************* */


//------------------------------------feature map eventlisterner------------------------------------
$(window).resize(function() {
	sizeLayerControl();
	if (document.body.clientWidth <= 767) {
		map.invalidateSize();
	}
  });

$(document).ready(function(){
  $("#sidebar").show();
})

$(document).on("click", ".feature-row", function (e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10), $(this).attr("layerID"));
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar(isLeveled);
});

/* Clear feature highlight when map is clicked */
map.on("click", function (e) {
  highlight.clearLayers();
});

$(document).one("ajaxStart", function () {
  $("#loading").show();
  sizeLayerControl();
});


$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
});




//------------------------------------search box instantiation------------------------------------
/* Highlight search box text on click *//*
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page *//*
$("#searchbox").keypress(function (e) {
  console.log(e)
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

function clearHighlight() {
  highlight.clearLayers();
}
*/
/* Typeahead search functionality *//*
function searchInitialization() {
  var theatersBH = new Bloodhound({
    name: "Theaters",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: theaterSearch,
    limit: 10
  });


  theatersBH.initialize();

  $('#bloodhound .typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'states',
    source: theatersBH
  });


}
*/

  /* instantiate the typeahead UI */
  /*
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Theaters",
    displayKey: "name",
    source: theatersBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/theater.png' width='28' height='28'>&nbsp;Theaters</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Theaters") {
      if (!map.hasLayer(theaterLayer)) {
        map.addLayer(theaterLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
}
searchInitialization()*/
