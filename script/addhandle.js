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

		case "homeown":
			var grades = [75, 50, 25, 0];
			var colors = ['#ffffb2', '#fecc5c', '#fd8d3c', '#e31a1c'];
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
			flagList[layerID] = 1;

			//for homeown, mouse events
			function onEachAdminFeatureForHomeown(feature, layer) {
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

			function getColorx(val, grades, colors) {
				for (i = 0; i < grades.length; i++)
					if (val >= grades[i])
						return colors[i];
				return '#ffffff';
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

			flagList[layerID] = 1;
			break;

		case "air_stations":
			air_stationsLayer = new L.markerClusterGroup({
				spiderfyOnMaxZoom: true,
				showCoverageOnHover: false,
				zoomToBoundsOnClick: true,
				disableClusteringAtZoom: 16,
				clusterPane: layerID + "Pane"
			});

			air_stationsFullLayer = L.geoJson(null, {
				pointToLayer: function (feature, latlng) {
					return new L.CircleMarker(latlng, {
						//radius: 10, 
						//fillOpacity: 0.85
						//This sets them as empty circles
						radius: 10,
						//this is the color of the center of the circle
						fillColor: "#000",
						//this is the color of the outside ring
						color: "#000",
						//this is the thickness of the outside ring
						weight: .5,
						//This is the opacity of the outside ring
						opacity: 1,
						//this is the opacity of the center. setting it to 0 makes the center transparent
						fillOpacity: 1,
						pane: layerID + "Pane"

					});
				},
				style: function (feature) {

					//makes stations with no readings black
					if ((feature.properties.ReadingO3 === null) && (feature.properties.ReadingPM25 === null) && (feature.properties.AQICat === null)) {
						return {
							fillColor: "#444444"
						};
					} else if ((feature.properties.ReadingO3 > 300) || (feature.properties.ReadingPM25 > 300)) {
						return {
							fillColor: "#7E0023"
						};
					}
					//Very Unhealth AQ 201-300
					else if ((feature.properties.ReadingO3 > 200 && feature.properties.ReadingO3 <= 300) || (feature.properties.ReadingPM25 > 200 && feature.properties.ReadingO3 <= 300)) {
						return {
							fillColor: "#8F3F97"
						};
					}
					//unhealthy aq 150-200
					else if ((feature.properties.ReadingO3 > 150 && feature.properties.ReadingO3 <= 200) || (feature.properties.ReadingPM25 > 150 && feature.properties.ReadingO3 <= 200)) {
						return {
							fillColor: "#FF0000"
						};
					}
					//Unhealth for Sensitive Groups
					else if ((feature.properties.ReadingO3 > 100 && feature.properties.ReadingO3 <= 150) || (feature.properties.ReadingPM25 > 100 && feature.properties.ReadingO3 <= 150)) {
						return {
							fillColor: "#FF7E00"
						};
					}
					//AQ moderate 51-100		
					else if ((feature.properties.ReadingO3 > 50 && feature.properties.ReadingO3 <= 100) || (feature.properties.ReadingPM25 > 50 && feature.properties.ReadingO3 <= 100)) {
						return {
							fillColor: "#FFFF00"
						};
					}


					// air quality is good 0-50
					else {
						return {
							fillColor: "#00E400"
						};
					}

				}, //end of style
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
						$("#feature-list tbody").append('<tr class="feature-row" layerID="' + layerID + '" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><span class="fa fa-stack fa-lg"><i class="fa fa-circle fa-stack-2x aq-color-' + layer.feature.properties.AQICat + '"></i><i class="fa fa-circle-thin fa-stack-2x"></i></span></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
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
			$.get("http://GEOG-CURA-PC5/_jsonAQIArrayGeoJSON.json", function (data) {
				air_stationsFullLayer.addData(data);
				air_stationsLayer.addLayer(air_stationsFullLayer)
				map.addLayer(air_stationsLayer);
			});
			flagList[layerID] = 2;
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

			flagList[layerID] = 2;
			break;


		case "gas":
			var LowIcon = L.Icon.extend({
				options: {
					shadow: null,
					iconSize: [25, 41], // size of the icon
					shadowSize: [41, 41], // size of the shadow
					iconAnchor: [12, 40], // point of the icon which will correspond to marker's location

					popupAnchor: [1, -40] // point from which the popup should open relative to the iconAnchor
				}
			});

			MidHighIcon = new LowIcon({
				shadow: null,
				iconUrl: 'http://gis.osu.edu/misc/gasprices/icons/marker-iconMidHi.png'
			});
			HighIcon = new LowIcon({
				shadow: null,
				iconUrl: 'http://gis.osu.edu/misc/gasprices/icons/marker-iconHi.png'
			});
			VeryHighIcon = new LowIcon({
				shadow: null,
				iconUrl: 'http://gis.osu.edu/misc/gasprices/icons/marker-iconVeryHI.png'
			});

			var icons = [];

			for (i = 0; i < 15; i++) {
				iconurl = 'http://gis.osu.edu/misc/gasprices/icons/marker-icon' + (i + 1) + '.png';
				var myicon = new LowIcon({
					iconUrl: iconurl
				});
				icons[icons.length] = myicon;
			}

			$.ajax({
				type: "GET",
				dataType: 'text',
				url: "http://gis.osu.edu/misc/gasprices/get-prices.php", // use this for client
				//url: "http://GEOG-CURA-PC5/gas.json", // use this for local test
				//url: "http://curio.osu.edu/api/trans/getGasTrendJSON.php",
				success: handleStations,
				error: function (request, status, error) {
					alert(status + 'Error: ' + error);
				}
			});


			function handleStations(result, status) {

				var lastIndex = result.lastIndexOf(",")
				console.log(lastIndex)
				result = result.slice(0, lastIndex - 1) + "}]}"
				console.log(result)
				testData = JSON.parse(result)

				date = testData.features[0].properties.date;
				len = testData.features.length;
				highestprice = testData.features[len - 1].properties.price;
				lowestprice = testData.features[0].properties.price;
				for (i = 0; i < testData.features.length; i++) {
					f = testData.features[i]
					lat = f.geometry.coordinates[1];
					lng = f.geometry.coordinates[0];
					if (f.properties.price == highestprice)
						var mymarker = L.marker([lat, lng], {
							icon: HighIcon,
							pane: layerID + "Pane"
						});
					else {
						if (i < icons.length)
							var mymarker = L.marker([lat, lng], {
								icon: icons[i],
								pane: layerID + "Pane"
							});
						else
							var mymarker = L.marker([lat, lng], {
								icon: MidHighIcon,
								pane: layerID + "Pane"
							});
					}
					mymarker.bindPopup('<b>$' + f.properties.price + '</b><br/>' +
						f.properties.name + "<br/>" +
						f.properties.address + "<br/>" +
						f.properties.date + "<br/>");
					mymarker.addTo(map);
				}
			};
			break;



		default:
			//user's custom layers
			//"JSON Points"
			//"JSON Polyline/Polygon"
			//"GeoServer tiles"
			//"GeoServer features" which users can't use.;)
			if (typeof (URL) == "undefined") {
				var URL = fullLayerFlags.getURLByLayerID(layerID);
			}
			if (typeof (featureType) == "undefined") {
				var featureType = fullLayerFlags.getFeatureTypeByLayerID(layerID);
			}
			if (typeof (dataType) == "undefined") {
				var dataType = fullLayerFlags.getDataTypeByLayerID(layerID)
			}
			console.log(layerID, dataType, URL, symbolType, jsonp, acolor)
			addDefaultHandles(layerID, dataType, URL, symbolType, jsonp, acolor);
			flagList[layerID] = 1


	}

	if (flagList[layerID] == 2) {
		POIFlagList[layerID] = true; //push layerID with features to demonstrate
	}

	if (isPined) {
		reSortHandle();
	}
	/*if (!flagList[layerID]){
		addDefaultHandles(layerID, dataType, URL, symbolType, jsonp, acolor);
	}*/
	//-----legend------
	addLegendHandle(layerID, URL, grades, colors, dataType, icons, acolor);


}