/* ******************************************************
 *
 *   Comprehensive Map Gallery using leaflet - addingLayer function javascript
 *
 *   Author: Luyu Liu 
 *   Contact: liu.6544@osu.edu
 *   Update Date:2017.10.12
 *
 * ******************************************************* */

function addingLayer(layerID) { ///////////////must add the layer to the corresponding pane! &&&& must adjust flag status
	switch (layerID) {
		case "tree":
			treeLayer = L.esri.tiledMapLayer({
				url: 'http://geog-cura-gis.asc.ohio-state.edu/arcgis/rest/services/CURIO/CBUSTreesByDiameter/MapServer',
				pane: layerID + 'Pane'
			});
			map.addLayer(treeLayer);
			flagList[layerID]=1;
			break;


		case "ohio":
			//jsonpdata receive
			Jsonp_URL = "http://localhost:8080/geoserver/POST/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=POST:county&maxFeatures=50&outputFormat=text%2Fjavascript&format_options=callback%3Agetjson"
			ohioLayer = receiveJsonp(Jsonp_URL, layerID);
			map.addLayer(ohioLayer);
			flagList[layerID]=1;
			break;


		case "homeown":
			var grades = [75, 50, 25, 0];
			var colors = ['#ffffb2','#fecc5c','#fd8d3c','#e31a1c' ];
			homeownLayer=L.geoJson(null,{
					style: function (feature) {
					edgeColor = "#bdbdbd";
					fillColor = getColorx(feature.properties.PCT_OWN, grades, colors);
					return {color: edgeColor,
						fillColor: fillColor,
						opacity: 1,
						fillOpacity: 0.90,
						weight: 0.5};
					},
					onEachFeature: onEachAdminFeature,
					pane: layerID + 'Pane'
					
					
				})
			
			
			$.get("http://geog-cura-pc5/morpcCensus.json", function (data) {
				homeownLayer.addData(data)
			});
			
			map.addLayer(homeownLayer);
			flagList[layerID]=1;
			break;


		case "sewer":
			var sewerMarker = L.AwesomeMarkers.icon({
				icon: 'coffee',
				markerColor: "black",
				shadow: null
			});
			sewerMarker.options.shadowSize = [0, 0]

			sewerLayer = L.esri.featureLayer({
				url: 'http://maps.columbus.gov/arcgis/rest/services/LegacyServices/SSOCSO/MapServer/0',
				pointToLayer: function (geojson, latlng) {
					return L.marker(latlng, {
							icon: sewerMarker,
							pane: layerID + "Pane"
						}
						///////////////////////////////////////////////////here goes the marker setting
					)
				}
			})
			map.addLayer(sewerLayer);
			flagList[layerID]=1;
			break;


		case "bikepath_path":
			bikepath_pathLayer = L.esri.tiledMapLayer({
				url: 'http://arcgiswebadp1.morpc.org/webadaptor/rest/services/bikes/BikemapLevelOfComfort/MapServer',
				pane: layerID + 'Pane'
			});
			map.addLayer(bikepath_pathLayer);
			flagList[layerID]=1;
			break;

		case "bikepath_green":
			bikepath_greenLayer = L.esri.featureLayer({
				url: 'http://arcgiswebadp1.morpc.org/webadaptor/rest/services/bikes/BikemapGreenways/MapServer/0',
				pane: layerID + 'Pane'
			})
			map.addLayer(bikepath_greenLayer);
			flagList[layerID]=1;
			break;

		case "bikepath_heads":
			var bikepath_headsMarker = L.AwesomeMarkers.icon({
				icon: 'coffee',
				markerColor: 'red',
				shadow: null
			});
			bikepath_headsMarker.options.shadowSize = [0, 0]

			bikepath_headsLayer = L.esri.featureLayer({
				url: 'http://arcgiswebadp1.morpc.org/webadaptor/rest/services/bikes/Bikemap_Trailheads/MapServer/0',
				pointToLayer: function (geojson, latlng) {
					return L.marker(latlng, {
							icon: bikepath_headsMarker,
							pane: layerID + "Pane"
						}
						///////////////////////////////////////////////////here goes the marker setting
					)
				}
			})
			map.addLayer(bikepath_headsLayer);
			flagList[layerID]=1;
			break;

		case "bikeshr_cogo"://about Pane: clustermarker and bikeshr_cogoFullLayer is in a same pane.
			/* Single marker cluster layer to hold all clusters */
			bikeshr_cogoLayer = new L.markerClusterGroup({
				spiderfyOnMaxZoom: true,
				showCoverageOnHover: false,
				zoomToBoundsOnClick: true,
				disableClusteringAtZoom: 16,
				clusterPane: layerID + "Pane"
			});
			bikeshr_cogoFullLayer = L.geoJson(null, {
				pointToLayer: function (feature, latlng) {
					return L.marker(latlng, {
						icon: L.icon({
							iconUrl: "./img/bikeshr_cogo.png",
							iconSize: [28, 28],
							iconAnchor: [12, 28],
							popupAnchor: [0, -25]
						}),
						title: feature.properties.name,
						riseOnHover: true,
						pane: layerID + "Pane"
					});
				},
				onEachFeature: function (feature, layer) {
					if (feature.properties) {
						var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Station Name</th><td>" + feature.properties.name + "</td></tr>" + "<tr><th>Available Bikes</th><td>" + feature.properties.availableBikes + "</td></tr>" + "<tr><th>Available Docks</th><td>" + feature.properties.availableDocks + "</td></tr>" + "<tr><th>Last Checked</th><td>" + feature.properties.timestamp + "</td></tr>" + "</table>" +
							<!--Streetview Div-->
							"<div  id='streetview' style='margin-top:10px;'><img class='center-block' src='https://maps.googleapis.com/maps/api/streetview?size=300x300&location=" + layer.getLatLng().lat + "," + layer.getLatLng().lng + "&key=AIzaSyCewGkupcv7Z74vNIVf05APjGOvX4_ygbc' height='300' width='300'></img><hr><h4 class='text-center'><a href='http://maps.google.com/maps?q=&layer=c&cbll=" + layer.getLatLng().lat + "," + layer.getLatLng().lng + "' target='_blank'>Google Streetview</a></h4</div>";


						layer.on({
							click: function (e) {
								
								var popup = L.popup().setLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).setContent(content).openOn(map);
								
								
								
								/*
								$("#feature-title").html(feature.properties.name);
								$("#feature-info").html(content);
								$("#featureModal").modal("show");
								highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));*/
							}
						});
						$("#feature-list tbody").append('<tr class="feature-row" layerID="'+layerID+'" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="img/bikeshr_cogo.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
						theaterSearch.push({
							name: layer.feature.properties.NAME,
							address: layer.feature.properties.ADDRESS1,
							source: "Theaters",
							id: L.stamp(layer),
							lat: layer.feature.geometry.coordinates[1],
							lng: layer.feature.geometry.coordinates[0]
						});
					}
				}
			});
			$.get("http://geog-cura-pc5/jsonCOGOArrayGeoJSON.json", function (data) {
				bikeshr_cogoFullLayer.addData(data);
				bikeshr_cogoLayer.addLayer(bikeshr_cogoFullLayer)
				map.addLayer(bikeshr_cogoLayer);
			});
			flagList[layerID]=2;
			break;

		case "bikeshr_zgst":
			/* ZAGSTER Layer Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
			bikeshr_zgstLayer = new L.markerClusterGroup({
				spiderfyOnMaxZoom: true,
				showCoverageOnHover: false,
				zoomToBoundsOnClick: true,
				disableClusteringAtZoom: 16,
				clusterPane: layerID + "Pane"
			});

			bikeshr_zgstFullLayer = L.geoJson(null, {
				pointToLayer: function (feature, latlng) {
					return L.marker(latlng, {
						icon: L.icon({
							iconUrl: "./img/bikeshr_zgst.png",
							iconSize: [28, 28],
							iconAnchor: [12, 28],
							popupAnchor: [0, -25]
						}),
						title: feature.properties.name,
						riseOnHover: true,
						pane: layerID + "Pane"
					});
				},
				onEachFeature: function (feature, layer) {
					if (feature.properties) {
						var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Station Name</th><td>" + feature.properties.name + "</td></tr>" + "</table><br><div  id='streetview'><img class='center-block' src='https://maps.googleapis.com/maps/api/streetview?size=300x300&location=" + layer.getLatLng().lat + "," + layer.getLatLng().lng + "&key=AIzaSyCewGkupcv7Z74vNIVf05APjGOvX4_ygbc' height='300' width='300'></img><hr><h4 class='text-center'><a href='http://maps.google.com/maps?q=&layer=c&cbll=" + layer.getLatLng().lat + "," + layer.getLatLng().lng + "' target='_blank'>Google Streetview</a></h4</div>";
						layer.on({
							click: function (e) {
								var popup = L.popup().setLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).setContent(content).openOn(map);
								
								/*
								$("#feature-title").html(feature.properties.name);
								$("#feature-info").html(content);
								$("#featureModal").modal("show");
								highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));*/
							}
						});
						$("#feature-list tbody").append('<tr class="feature-row" layerID="'+layerID+'" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="img/bikeshr_zgst.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
						theaterSearch.push({
							name: layer.feature.properties.NAME,
							address: layer.feature.properties.ADDRESS1,
							source: "Theaters",
							id: L.stamp(layer),
							lat: layer.feature.geometry.coordinates[1],
							lng: layer.feature.geometry.coordinates[0]
						});
					}
				}

			});
			$.get("http://geog-cura-pc5/jsonZagsterArrayGeoJSON.json", function (data) {
				bikeshr_zgstFullLayer.addData(data);
				bikeshr_zgstLayer.addLayer(bikeshr_zgstFullLayer);
				map.addLayer(bikeshr_zgstLayer);
			});
			flagList[layerID]=2;
			break;
			
			

	}

}