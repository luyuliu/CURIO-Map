/* ******************************************************
 *
 *   Comprehensive Map Gallery using leaflet - addingLayer function javascript
 *
 *   Author: Luyu Liu 
 *   Contact: liu.6544@osu.edu
 *
 * ******************************************************* */

function checkedHandle(layerID, dataType, URL, symbolType, jsonp, acolor) {
	/*must:
	1. add layer to corresponding pane;
	2. change flagList status;
	3. if entering parameters only include layerID, then entering switch branches is necessary.
	*/


	switch (layerID) {
		case "tree":
			var url = 'http://geog-cura-gis.asc.ohio-state.edu/arcgis/rest/services/CURIO/CBUSTreesByDiameter/MapServer'
			treeLayer = L.esri.tiledMapLayer({
				url: url,
				pane: layerID + 'Pane'
			});
			map.addLayer(treeLayer);
			flagList[layerID] = 1;

			getMapServerLegendDiv(layerID, url + '/legend?f=pjson')
			break;

		case "homeown":
			var grades = [75, 50, 25, 0];
			var colors = ['#ffffb2','#fecc5c','#fd8d3c','#e31a1c'];
			homeownLayer = L.geoJson(null, {
				style: function (feature) {
					edgeColor = "#bdbdbd";
					fillColor = getColorx(feature.properties.PCT_OWN, grades, colors);
					return {
						color: edgeColor,
						fillColor: fillColor,
						opacity: 1,
						fillOpacity: 0.90,
						weight: 0.5
					};
				},
				onEachFeature: onEachAdminFeatureForHomeown,
				pane: layerID + 'Pane'

			})


			$.get("https://luyuliu.github.io/CURIO-Map/data/morpcCensus.json", function (data) {
				homeownLayer.addData(data)
			});

			map.addLayer(homeownLayer);


			getGraduatedColorsDiv(layerID,grades,colors)
			flagList[layerID] = 1;
			break;


		case "sewer":
			var sewerMarker = L.AwesomeMarkers.icon({
				icon: 'filter',
				markerColor: 'green',
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
			getIconBlockDiv(layerID,"filter","green","sewer")

			flagList[layerID] = 1;
			break;


		case "bikepath_path":
			var url='http://arcgiswebadp1.morpc.org/webadaptor/rest/services/bikes/BikemapLevelOfComfort/MapServer'
			bikepath_pathLayer = L.esri.tiledMapLayer({
				url: url,
				pane: layerID + 'Pane'
			});
			map.addLayer(bikepath_pathLayer);
			getMapServerLegendDiv(layerID, url + '/legend?f=pjson')
			flagList[layerID] = 1;
			break;

		case "bikepath_green":
			bikepath_greenLayer = L.esri.featureLayer({
				url: 'http://arcgiswebadp1.morpc.org/webadaptor/rest/services/bikes/BikemapGreenways/MapServer/0',
				pane: layerID + 'Pane'
			})
			map.addLayer(bikepath_greenLayer);
			getIconBlockDiv(layerID,"line", "blue", "Greenway")
			flagList[layerID] = 1;
			break;

		case "bikepath_heads":
			var bikepath_headsMarker = L.AwesomeMarkers.icon({
				icon: 'cog',
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

			getIconBlockDiv(layerID,"cog","red","Trailheads")
			flagList[layerID] = 1;
			break;

		case "bikeshr_cogo": //about Pane: clustermarker and bikeshr_cogoFullLayer is in a same pane.
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
						var content = "<h4>" + "Station Name: " + feature.properties.name + "<br/>" + "Available Bikes: " + feature.properties.availableBikes + "<br/>" + "Available Docks: " + feature.properties.availableDocks + "<br/>" + "Last Checked: " + feature.properties.timestamp + "</h4><br/>" +
							"<!--Streetview Div-->" +
							"<div  id='streetview' style='margin-top:10px;'><img class='center-block' src='https://maps.googleapis.com/maps/api/streetview?size=300x300&location=" + layer.getLatLng().lat + "," + layer.getLatLng().lng + "&key=AIzaSyCewGkupcv7Z74vNIVf05APjGOvX4_ygbc' height='300' width='300'></img><hr><h4 class='text-center'><a href='http://maps.google.com/maps?q=&layer=c&cbll=" + layer.getLatLng().lat + "," + layer.getLatLng().lng + "' target='_blank'>Google Streetview</a></h4</div>";


						layer.on({
							click: function (e) {
								var popup = L.popup().setLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).setContent(content).openOn(map);
							}
						});
						$("#feature-list tbody").append('<tr class="feature-row" layerID="' + layerID + '" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="img/bikeshr_cogo.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
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
			$.get("https://luyuliu.github.io/CURIO-Map/data/COGOArrayGeoJSON.json", function (data) {
				bikeshr_cogoFullLayer.addData(data);
				bikeshr_cogoLayer.addLayer(bikeshr_cogoFullLayer)
				map.addLayer(bikeshr_cogoLayer);
			});
			getIconBlockDiv(layerID, "pic", null, "Cogo", "./img/bikeshr_cogo.png")
			flagList[layerID] = 2;
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
						var content = "<h4>" + "Station Name: " + feature.properties.name + "</h4><br/>" + "</table><br><div  id='streetview'><img class='center-block' src='https://maps.googleapis.com/maps/api/streetview?size=300x300&location=" + layer.getLatLng().lat + "," + layer.getLatLng().lng + "&key=AIzaSyCewGkupcv7Z74vNIVf05APjGOvX4_ygbc' height='300' width='300'></img><hr><h4 class='text-center'><a href='http://maps.google.com/maps?q=&layer=c&cbll=" + layer.getLatLng().lat + "," + layer.getLatLng().lng + "' target='_blank'>Google Streetview</a></h4</div>";
						layer.on({
							click: function (e) {
								var popup = L.popup().setLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).setContent(content).openOn(map);
							}
						});
						$("#feature-list tbody").append('<tr class="feature-row" layerID="' + layerID + '" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="img/bikeshr_zgst.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
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
			$.get("https://luyuliu.github.io/CURIO-Map/data/ZagsterArrayGeoJSON.json", function (data) {
				bikeshr_zgstFullLayer.addData(data);
				bikeshr_zgstLayer.addLayer(bikeshr_zgstFullLayer);
				map.addLayer(bikeshr_zgstLayer);
			});
			getIconBlockDiv(layerID, "pic", null, "Zagster", "./img/bikeshr_zgst.png")
			flagList[layerID] = 2;
			break;


		case "gas":
			
			break;

		default:
			//user's custom layers
			//"JSON Points"
			//"JSON Polyline/Polygon"
			//"GeoServer tiles"
			addDefaultHandles(layerID,dataType, URL, symbolType, jsonp, acolor);


	}

}