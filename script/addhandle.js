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

	document.getElementById(layerID + "-legend-btn").removeAttribute("disabled")
	if (URL === undefined) {
		URL = fullLayerFlags.getItemByLayerID(layerID).URL
	}
	if (dataType === undefined) {
		dataType = fullLayerFlags.getItemByLayerID(layerID).dataType
	}

	switch (layerID) {

		case "eth_asian":
			colors = ["#C71585", "#FF1493", "#FF69B4", "#FFC0CB", "#f7e3e3"];
			grades = [3.99, 1.83, 0.94, 0.34];
			variables = ["AsianNH", "AsianNHPct", "Total"];
			break;

		case "eth_his":
			colors = ["#8B0000", "#CD5C5C", "#F08080", "#FFA07A", "#f7e3e3"];
			grades = [4.86, 2.84, 1.87, 1.16];
			variables = ["Hispanic", "HispPct", "Total"];
			break;

		case "eth_black":
			colors = ["#006400", "#008000", "#3CB371", "#9ACD32", "#DDF9D2"];
			grades = [33.5, 9.4, 3.17, 1.08];
			variables = ["BlackNH", "BlackNHPct", "Total"];
			break;

		case "eth_white":
			colors = ["#000080", "#0000CD", "#6495ED", "#B0C4DE", "#DDF9D2"];
			grades = [94.3, 88.67, 77.87, 53.3];
			variables = ["WhiteNH", "WhiteNHPct", "Total"];
			break;

		case "med_income":
			colors = ["#800000", "#A52A2A", "#A0522D", "#DEB887", "#FFF8DC"];
			grades = [81780, 61284, 43577, 30064];
			variables = ["Total", "MEDINCOME"];
			break;

		case "commute_min":
			colors = ["#2F4F4F", "#778899", "#808080", "#A9A9A9", "#D3D3D3"];
			grades = [27, 24, 22, 19];
			variables = ["Total", "COMMUTEMIN"];
			break;

		case "walk_rate":
			colors = ["#2F4F4F", "#778899", "#808080", "#A9A9A9", "#D3D3D3"];
			grades = [6.01, 2.94, 2.94, 1.53];
			variables = ["Total", "WALKRATE"];
			break;

		case "auto_rate":
			colors = ["#2F4F4F", "#778899", "#808080", "#A9A9A9", "#D3D3D3"];
			grades = [90, 85.6, 80.7, 72.4];
			variables = ["Total", "AUTORATE"];
			break;

		case "trans_rate":
			colors = ["#2F4F4F", "#778899", "#808080", "#A9A9A9", "#D3D3D3"];
			grades = [8.25, 3.97, 1.77, 0];
			variables = ["Total", "TRANSRATE"];
			break;

		case "bike_rate":
			colors = ["#2F4F4F", "#778899", "#808080", "#A9A9A9", "#D3D3D3"];
			grades = [4.93, 2.64, 1.44, 0];
			variables = ["Total", "BIKERATE"];
			break;

		case "pool_rate":
			colors = ["#2F4F4F", "#778899", "#808080", "#A9A9A9", "#D3D3D3"];
			grades = [27, 24, 22, 19];
			variables = ["Total", "POOLRATE"];
			break;
	}
	switch (layerID) {
		case "columbus311":
			console.log("it's there");
			URL = 'http://maps2.columbus.gov/arcgis/rest/services/Applications/ServiceRequests/MapServer/22';
			//URL="http://cura-gis-web.asc.ohio-state.edu/arcgis/rest/services/CURIO/Columbus_Trees/MapServer";
			columbus311Layer = L.esri.featureLayer({
				url: URL,
				pointToLayer: function (feature, latlng) {
					if (feature.properties.STATUS == "CLOSED") {
						return L.circleMarker(latlng, {
								radius: 4,
								color: "#33B001",
								pane: layerID + "Pane",
								fillOpacity: 0.85
							}
							///////////////////////////////////////////////////here goes the marker setting
						)
					} else {
						return L.circleMarker(latlng, {
								radius: 4,
								color: "#FF5656",
								pane: layerID + "Pane",
								fillOpacity: 0.85
							}
							///////////////////////////////////////////////////here goes the marker setting
						)
					}

				},
				onEachFeature: function (feature, layer) {
					if (feature.properties) {
						var content = "<h4>" + "Address: " + feature.properties.LOCATION_DESCRIPTION + "</h4><br/>" +
							"Section Name: " + feature.properties.SECTION_NAME + "<br/>" +
							"Referral Name: " + feature.properties.REFERRAL_NAME + "<br/>" +
							"Division Name: " + feature.properties.DIVISION_NAME + "<br/>" +
							"Category: " + feature.properties.SR_CATEGORY + "<br/>" +
							"Status: " + feature.properties.STATUS + "<br/>" +
							"Description: " + feature.properties.SWR_TYPE + "<br/>" +
							"<!--Streetview Div-->" +
							"<div  id='streetview' style='margin-top:10px;'><hr><h4 class='text-center'><a href='http://maps.google.com/maps?q=&layer=c&cbll=" + layer.getLatLng().lat + "," + layer.getLatLng().lng + "' target='_blank'>Google Streetview</a></h4</div>";

						layer.on({
							click: function (e) {
								var popup = L.popup().setLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).setContent(content).openOn(map);
							}
						});
						//$("#feature-list tbody").append('<tr class="feature-row" layerID="' + layerID + '" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="img/parkingmeters.png"></td><td class="feature-name">' + layer.feature.properties.LOCATION +" , "+layer.feature.properties.METER_ID+ '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');

					}
				}
			}).addTo(map);
			flagList[layerID] = 1;
			break;

		case "bikepath_heads":
			var legendURL = URL.substring(0, URL.indexOf("MapServer") + 9) + '/legend?f=pjson';
			var numberOfLayer = URL.substring(URL.lastIndexOf("/") + 1, URL.lastIndexOf("/") + 2);
			$.ajax({
				url: legendURL,
				type: 'GET',
				dataType: 'JSON',
				success: function (data) {
					var numberOfIcon = data.layers[numberOfLayer].legend.length;
					iconurls = [];

					for (var jj = 0; jj < numberOfIcon; jj++) {
						iconurls.push('data:image/png;base64,' + data.layers[numberOfLayer].legend[jj].imageData);
					}
					var codeString = layerID + 'Layer = L.esri.featureLayer({' +
						'url: URL,' +

						'pointToLayer:function (feature, latlng) {var jjj;' +
						'if(feature.properties.Type=="ParkandPedal"){jjj=0}else{jjj=1}' +
						'return L.marker(latlng, {' +
						'icon: L.icon({' +
						'iconUrl:  iconurls[jjj],' +
						'iconSize: [28, 28],' +
						'iconAnchor: [12, 28],' +
						'popupAnchor: [0, -25]' +
						'}),' +

						'riseOnHover: true,' +
						'pane: "' + layerID + 'Pane",' +
						'title: feature.properties.Name' +
						'});' +
						'},' +

						'style:function(feature){' +
						'return {color:"' + acolor + '"};' +
						'},' +
						'pane: "' + layerID + 'Pane",' +
						'ignoreRenderer:false' +
						'})' //very ugly, I know.
					eval(codeString)
					eval("map.addLayer(" + layerID + "Layer)")

					bikepath_headsLayer.bindPopup(function (layer) {
						return 'Name: ' + layer.feature.properties.Name + "</br>TrailName: " + layer.feature.properties.TrailName + "</br>Type: " + layer.feature.properties.Type +
							"<!--Streetview Div-->" +
							"<div  id='streetview' style='margin-top:10px;'><hr><h4 class='text-center'><a href='http://maps.google.com/maps?q=&layer=c&cbll=" + layer.getLatLng().lat + "," + layer.getLatLng().lng + "' target='_blank'>Google Streetview</a></h4</div>";
					});

				}
			});
			flagList[layerID] = 1;
			break;

		case "homeown":
			var grades = [75, 50, 25, 0];
			var colors = ['#e31a1c', '#fd8d3c', '#fecc5c', '#ffffb2'];
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

			/*case "cota":
				cotaLayer = new L.markerClusterGroup({
					spiderfyOnMaxZoom: true,
					showCoverageOnHover: false,
					zoomToBoundsOnClick: true,
					disableClusteringAtZoom: 12,
					clusterPane: layerID + "Pane"
				});

				cotaFullLayer = L.geoJson(null, {
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
							//fillOpacity: 1,
							pane: layerID + "Pane",
						});
					},
					style: function (feature) {


						if (feature.properties.TOTAL > 900) {
							return {
								fillColor: "#253494",
								radius: 45
							};
						} else if (feature.properties.TOTAL > 500) {
							return {
								fillColor: "#2c7fb8",
								radius: 35
							};
						} else if (feature.properties.TOTAL > 99) {
							return {
								fillColor: "#41b6c4",
								radius: 25
							};
						} else if (feature.properties.TOTAL > 50) {
							return {
								fillColor: "#a1dab4",
								radius: 15
							};
						} else {
							return {
								fillColor: "#ffffcc"
							};
						}

					}, //end of style
					onEachFeature: function (feature, layer) {
						if (feature.properties) {
							var content = "<h4>" + "Station Name: " + feature.properties.STOP_NAME + "<br/>" + "Bus route: " + feature.properties.COTA_ROUTE + "<br/>" + "On bus count: " + feature.properties.ON + "<br/>" + "Off bus count: " + feature.properties.OFF + "<br/>" + "Total count: " + feature.properties.TOTAL + "<br/>" + "Running day: " + feature.properties.DAY_OF_WEEK + "</h4><br/>" +
								"<!--Streetview Div-->" +
								"<div  id='streetview' style='margin-top:10px;'><img class='center-block' src='https://maps.googleapis.com/maps/api/streetview?size=300x300&location=" + layer.getLatLng().lat + "," + layer.getLatLng().lng + "&key=AIzaSyCewGkupcv7Z74vNIVf05APjGOvX4_ygbc' height='300' width='300'></img><hr><h4 class='text-center'><a href='http://maps.google.com/maps?q=&layer=c&cbll=" + layer.getLatLng().lat + "," + layer.getLatLng().lng + "' target='_blank'>Google Streetview</a></h4</div>";


							layer.on({
								click: function (e) {
									var popup = L.popup().setLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).setContent(content).openOn(map);
								}
							});
							$("#feature-list tbody").append('<tr class="feature-row" layerID="' + layerID + '" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><span class="fa fa-stack fa-lg"><i class="fa fa-circle fa-stack-2x cota-color-' + returnColor(feature.properties.TOTAL) + '"></i><i class="fa fa-circle-thin fa-stack-2x"></i></span></td><td class="feature-name">' + layer.feature.properties.STOP_NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
							theaterSearch.push({
								name: layer.feature.properties.STOP_NAME,
								address: layer.feature.properties.ADDRESS1,
								source: "Theaters",
								id: L.stamp(layer),
								lat: layer.feature.geometry.coordinates[1],
								lng: layer.feature.geometry.coordinates[0]
							});
						}
					}
				});
				$.get("https://luyuliu.github.io/CURIO-Map/data/weekdayRiders1000.json", function (data) {
					cotaFullLayer.addData(data);
					cotaLayer.addLayer(cotaFullLayer)
					map.addLayer(cotaLayer);
				});
				flagList[layerID] = 2;


				break;*/

		case "wshd_wshd":

			URL = 'http://cura-gis-web.asc.ohio-state.edu/arcgis/rest/services/CURIO/NHDWater2/MapServer'
			eval(layerID + "Layer = L.esri.tiledMapLayer({" +
				"url: '" + URL + "'," +
				"pane: layerID + 'Pane'" +
				"});")
			eval("map.addLayer(" + layerID + "Layer);")
			flagList[layerID] = 1;
			break;

		case "parkingmeters": //about Pane: clustermarker and parkingmetersFullLayer is in a same pane.
			/* Single marker cluster layer to hold all clusters */

			parkingmetersLayer = new L.markerClusterGroup({
				chunkedLoading: true,
				spiderfyOnMaxZoom: true,
				showCoverageOnHover: false,
				zoomToBoundsOnClick: true,
				disableClusteringAtZoom: 18,
				animateAddingMarkers: false,
				removeOutsideVisibleBounds: true,
				clusterPane: layerID + "Pane"
			});

			parkingmetersLayer._getExpandedVisibleBounds = function () {
				return parkingmetersLayer._map.getBounds();
			};

			parkingmetersFullLayer = L.geoJson(null, {
				pointToLayer: function (feature, latlng) {
					return L.marker(latlng, {
						icon: L.icon({
							iconUrl: "./img/parkingmeters.png",
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
						var content = "<h4>" + "Meter ID: " + feature.properties.METER_ID + "</h4><br/>" +
							"Location: " + feature.properties.LOCATION + "<br/>" +
							"Side of street: " + feature.properties.SIDE_OF_STREET + "<br/>" +
							"Block face: " + feature.properties.BLOCKFACE + "<br/>" +
							"Meter status: " + feature.properties.METER_STATUS + "<br/>" +
							"Tow away hours: " + feature.properties.TOW_AWAY_HOURS + "<br/>" +
							"Rate: " + feature.properties.RATE + "<br/>" +
							"Meter time: " + feature.properties.METER_TIME + "<br/>" +
							"Charging station: " + feature.properties.CHARGING_STATION + "</h4><br/>" +
							"<!--Streetview Div-->" +
							"<div  id='streetview' style='margin-top:10px;'><hr><h4 class='text-center'><a href='http://maps.google.com/maps?q=&layer=c&cbll=" + layer.getLatLng().lat + "," + layer.getLatLng().lng + "' target='_blank'>Google Streetview</a></h4</div>";

						layer.on({
							click: function (e) {
								var popup = L.popup().setLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).setContent(content).openOn(map);
							}
						});
						//$("#feature-list tbody").append('<tr class="feature-row" layerID="' + layerID + '" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="img/parkingmeters.png"></td><td class="feature-name">' + layer.feature.properties.LOCATION +" , "+layer.feature.properties.METER_ID+ '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');

					}
				}
			});
			$.get("https://luyuliu.github.io/CURIO-Map/data/Parking_Meters.json", function (data) {
				parkingmetersFullLayer.addData(data);
				parkingmetersLayer.addLayer(parkingmetersFullLayer)
				map.addLayer(parkingmetersLayer);
			});
			flagList[layerID] = 2;


			break;
			/*
					case "demo":
						var grades = [2000, 1500, 1000, 500, 0];
						var colors = ['#004FC1', '#0269FF', '#5E9FFE', '#A9CCFF', '#E6F0FF'];
						demoLayer = L.geoJson(null, {
							style: function (feature) {
								edgeColor = "#bdbdbd";
								fillColor = getColorx(feature.properties.Total, grades, colors);
								return {
									color: edgeColor,
									fillColor: fillColor,
									opacity: 1,
									fillOpacity: 0.90,
									weight: 0.5
								};
							},
							onEachFeature: onEachAdminFeatureForDemo,
							pane: layerID + 'Pane'

						})

						function onEachAdminFeatureForDemo(feature, layer) {
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
									var popupContent = "<h4>" + "Total population: " + feature.properties.Total + "</h4>" +
										"Hispanic population: " + feature.properties.Franklin_2 + "<br/>" +
										"Hispanic population proportion: " + feature.properties.HispPct + "%<br/>" +
										"White population: " + feature.properties.White + "<br/>" +
										"White population proportion: " + feature.properties.WhitePct + "%<br/>" +
										"Black population: " + feature.properties.Black + "<br/>" +
										"Black population proportion: " + feature.properties.BlkPct + "%<br/>" +
										"Asian population: " + feature.properties.Asian + "<br/>" +
										"Asian population proportion: " + feature.properties.AsianPct + "%<br/>"

									var popup = L.popup().setLatLng([e.latlng.lat, e.latlng.lng]).setContent(popupContent).openOn(map);
								}
							});
						}

						$.get("https://luyuliu.github.io/CURIO-Map/data/frankin.json", function (data) {
							demoLayer.addData(data)
						});

						map.addLayer(demoLayer);
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
									var content = "<h4>" + "Station Name: " + feature.properties.name + "<br/>" + "PM2.5 Reading: " + feature.properties.ReadingPM25 + "<br/>" + "O3 Reading: " + feature.properties.ReadingO3 + "<br/>" + "Last Checked: " + feature.properties.timestamp + "</h4><br/>" +
										"<!--Streetview Div-->" +
										"<div  id='streetview' style='margin-top:10px;'><img class='center-block' src='https://maps.googleapis.com/maps/api/streetview?size=300x300&location=" + layer.getLatLng().lat + "," + layer.getLatLng().lng + "&key=AIzaSyCewGkupcv7Z74vNIVf05APjGOvX4_ygbc' height='300' width='300'></img><hr><h4 class='text-center'><a href='http://maps.google.com/maps?q=&layer=c&cbll=" + layer.getLatLng().lat + "," + layer.getLatLng().lng + "' target='_blank'>Google Streetview</a></h4</div>";


									layer.on({
										click: function (e) {
											var popup = L.popup().setLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).setContent(content).openOn(map);
										}
									});
									$("#feature-list tbody").append('<tr class="feature-row" layerID="' + layerID + '" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><span class="fa fa-stack fa-lg"><i class="fa fa-circle fa-stack-2x aq-color-' + layer.feature.properties.AQICat + '"></i><i class="fa fa-circle-thin fa-stack-2x"></i></span></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
									theaterSearch.push({ //?????????????????
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
						$.get("https://luyuliu.github.io/CURIO-Map/data/AirArrayGeoJSON.json", function (data) {
							air_stationsFullLayer.addData(data);
							air_stationsLayer.addLayer(air_stationsFullLayer)
							map.addLayer(air_stationsLayer);
						});
						flagList[layerID] = 2;
						break;

			*/

		case "bikeshr_cogo": //about Pane: clustermarker and bikeshr_cogoFullLayer is in a same pane.
			/* Single marker cluster layer to hold all clusters */
			bikeshr_cogoLayer = new L.markerClusterGroup({
				showCoverageOnHover: false,
				zoomToBoundsOnClick: true,
				disableClusteringAtZoom: 15,
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
							"<div  id='streetview' style='margin-top:10px;'><hr><h4 class='text-center'><a href='http://maps.google.com/maps?q=&layer=c&cbll=" + layer.getLatLng().lat + "," + layer.getLatLng().lng + "' target='_blank'>Google Streetview</a></h4</div>";


						layer.on({
							click: function (e) {
								var popup = L.popup().setLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).setContent(content).openOn(map);
							}
						});
						$("#feature-list tbody").append('<tr class="feature-row" layerID="' + layerID + '" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="img/bikeshr_cogo.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');

					}
				}
			});
			/*$.get("https://luyuliu.github.io/CURIO-Map/data/COGOArrayGeoJSON.json", function (data) {

				bikeshr_cogoFullLayer.addData(data);
				bikeshr_cogoLayer.addLayer(bikeshr_cogoFullLayer)
				map.addLayer(bikeshr_cogoLayer);
			});
			flagList[layerID] = 2;*/

			$.get("http://feeds.cogobikeshare.com/stations/stations.json", function (schedule) {
				console.log(schedule)
				data = {}
				data.features = []
				data.type = "FeatureCollection"
				for (var i = 0; i < schedule.stationBeanList.length; i++) {
					everyStation = {}
					everyStation.geometry = {}
					everyStation.geometry.type = "Point"
					everyStation.geometry.coordinates = [schedule.stationBeanList[i].latitude, schedule.stationBeanList[i].longitude]
					everyStation.properties = {}
					everyStation.properties.station_id = schedule.stationBeanList[i].id
					everyStation.properties.name = schedule.stationBeanList[i].stationName
					everyStation.properties.address = schedule.stationBeanList[i].stAddress1
					everyStation.properties.capacity = schedule.stationBeanList[i].totalDocks
					everyStation.properties.availableBikes = schedule.stationBeanList[i].availableBikes
					everyStation.properties.availableDocks = schedule.stationBeanList[i].availableDocks
					everyStation.properties.timestamp = schedule.stationBeanList[i].lastCommunicationTime
					data.features.append(everyStation)
				}
				bikeshr_cogoFullLayer.addData(data);
				bikeshr_cogoLayer.addLayer(bikeshr_cogoFullLayer)
				map.addLayer(bikeshr_cogoLayer);
			});

			flagList[layerID] = 2;
			break;

			/*case "waste":
			wasteLayer = new L.markerClusterGroup({
					showCoverageOnHover: false,
					zoomToBoundsOnClick: true,
					disableClusteringAtZoom: 18,
					clusterPane: layerID + "Pane"
				});


				wasteFullLayer = L.geoJson(null, {
					onEachFeature: function (feature, layer) {
					console.log(layer)
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
							eval(layerID + "FullLayer" + ".resetStyle(e.target);")
						},
						click: function (e) {
							// TODO: click
							feature = e.target.feature;
							var popupContent = "<h4>" + "Unit name: " + feature.properties.UNIT_NAME + "</h4>"

							var popup = L.popup().setLatLng([e.latlng.lat, e.latlng.lng]).setContent(popupContent).openOn(map);
						}
					});
					}
				});


				$.get("https://luyuliu.github.io/CURIO-Map/data/Recycling__Yard_Waste_Zones.geojson", function (data) {
					wasteFullLayer.addData(data);
					wasteLayer.addLayer(wasteFullLayer)
					map.addLayer(wasteLayer);
				});

				map.addLayer(wasteLayer);
				flagList[layerID] = 1;

				break;*/

		case "industry": //about Pane: clustermarker and parkingmetersFullLayer is in a same pane.
			/* Single marker cluster layer to hold all clusters */

			industryLayer = new L.markerClusterGroup({
				chunkedLoading: true,
				spiderfyOnMaxZoom: true,
				showCoverageOnHover: false,
				zoomToBoundsOnClick: true,
				disableClusteringAtZoom: 18,
				animateAddingMarkers: false,
				removeOutsideVisibleBounds: true,
				clusterPane: layerID + "Pane"
			});

			industryLayer._getExpandedVisibleBounds = function () {
				return industryLayer._map.getBounds();
			};

			industryFullLayer = L.geoJson(null, {
				pointToLayer: function (feature, latlng) {
					return L.marker(latlng, {
						icon: L.icon({
							iconUrl: "./img/industry.png",
							iconSize: [28, 28],
							iconAnchor: [12, 28],
							popupAnchor: [0, -25]
						}),
						title: feature.properties.POI_NAME,
						riseOnHover: true,
						pane: layerID + "Pane"
					});
				},
				onEachFeature: function (feature, layer) {
					if (feature.properties) {
						var content = "<h4>" + "Address: " + feature.properties.LSN + "</h4><br/>" +
							"Name: " + feature.properties.POI_NAME + "<br/>" +
							"Type: " + feature.properties.POI_TYPE + "<br/>" +
							"<!--Streetview Div-->" +
							"<div  id='streetview' style='margin-top:10px;'><hr><h4 class='text-center'><a href='http://maps.google.com/maps?q=&layer=c&cbll=" + layer.getLatLng().lat + "," + layer.getLatLng().lng + "' target='_blank'>Google Streetview</a></h4</div>";

						layer.on({
							click: function (e) {
								var popup = L.popup().setLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).setContent(content).openOn(map);
							}
						});
						//$("#feature-list tbody").append('<tr class="feature-row" layerID="' + layerID + '" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="img/parkingmeters.png"></td><td class="feature-name">' + layer.feature.properties.LOCATION +" , "+layer.feature.properties.METER_ID+ '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');

					}
				}
			});
			$.get("https://luyuliu.github.io/CURIO-Map/data/Industrial_Facilties.json", function (data) {
				industryFullLayer.addData(data);
				industryLayer.addLayer(industryFullLayer)
				map.addLayer(industryLayer);
			});
			flagList[layerID] = 2;


			break;

		case "emergency": //about Pane: clustermarker and parkingmetersFullLayer is in a same pane.
			/* Single marker cluster layer to hold all clusters */

			emergencyLayer = new L.markerClusterGroup({
				chunkedLoading: true,
				spiderfyOnMaxZoom: true,
				showCoverageOnHover: false,
				zoomToBoundsOnClick: true,
				disableClusteringAtZoom: 18,
				animateAddingMarkers: false,
				removeOutsideVisibleBounds: true,
				clusterPane: layerID + "Pane"
			});

			emergencyLayer._getExpandedVisibleBounds = function () {
				return emergencyLayer._map.getBounds();
			};

			emergencyFullLayer = L.geoJson(null, {
				pointToLayer: function (feature, latlng) {
					return L.marker(latlng, {
						icon: L.icon({
							iconUrl: "./img/emergency.png",
							iconSize: [28, 28],
							iconAnchor: [12, 28],
							popupAnchor: [0, -25]
						}),
						title: feature.properties.POI_NAME,
						riseOnHover: true,
						pane: layerID + "Pane"
					});
				},
				onEachFeature: function (feature, layer) {
					if (feature.properties) {
						var content = "<h4>" + "Address: " + feature.properties.LSN + "</h4><br/>" +
							"Name: " + feature.properties.POI_NAME + "<br/>" +
							"Type: " + feature.properties.POI_TYPE + "<br/>" +
							"<!--Streetview Div-->" +
							"<div  id='streetview' style='margin-top:10px;'><hr><h4 class='text-center'><a href='http://maps.google.com/maps?q=&layer=c&cbll=" + layer.getLatLng().lat + "," + layer.getLatLng().lng + "' target='_blank'>Google Streetview</a></h4</div>";

						layer.on({
							click: function (e) {
								var popup = L.popup().setLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).setContent(content).openOn(map);
							}
						});
						//$("#feature-list tbody").append('<tr class="feature-row" layerID="' + layerID + '" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="img/parkingmeters.png"></td><td class="feature-name">' + layer.feature.properties.LOCATION +" , "+layer.feature.properties.METER_ID+ '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');

					}
				}
			});
			$.get("https://luyuliu.github.io/CURIO-Map/data/Emergency_Response_Facilities.json", function (data) {
				console.log(data)
				emergencyFullLayer.addData(data);
				emergencyLayer.addLayer(emergencyFullLayer)
				map.addLayer(emergencyLayer);
			});
			flagList[layerID] = 2;


			break;

		case "medical": //about Pane: clustermarker and parkingmetersFullLayer is in a same pane.
			/* Single marker cluster layer to hold all clusters */

			medicalLayer = new L.markerClusterGroup({
				chunkedLoading: true,
				spiderfyOnMaxZoom: true,
				showCoverageOnHover: false,
				zoomToBoundsOnClick: true,
				disableClusteringAtZoom: 18,
				animateAddingMarkers: false,
				removeOutsideVisibleBounds: true,
				clusterPane: layerID + "Pane"
			});

			medicalLayer._getExpandedVisibleBounds = function () {
				return medicalLayer._map.getBounds();
			};

			medicalFullLayer = L.geoJson(null, {
				pointToLayer: function (feature, latlng) {
					return L.marker(latlng, {
						icon: L.icon({
							iconUrl: "./img/medical.png",
							iconSize: [28, 28],
							iconAnchor: [12, 28],
							popupAnchor: [0, -25]
						}),
						title: feature.properties.POI_NAME,
						riseOnHover: true,
						pane: layerID + "Pane"
					});
				},
				onEachFeature: function (feature, layer) {
					if (feature.properties) {
						var content = "<h4>" + "Address: " + feature.properties.LSN + "</h4><br/>" +
							"Name: " + feature.properties.POI_NAME + "<br/>" +
							"Type: " + feature.properties.POI_TYPE + "<br/>" +
							"<!--Streetview Div-->" +
							"<div  id='streetview' style='margin-top:10px;'><hr><h4 class='text-center'><a href='http://maps.google.com/maps?q=&layer=c&cbll=" + layer.getLatLng().lat + "," + layer.getLatLng().lng + "' target='_blank'>Google Streetview</a></h4</div>";

						layer.on({
							click: function (e) {
								var popup = L.popup().setLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).setContent(content).openOn(map);
							}
						});
						//$("#feature-list tbody").append('<tr class="feature-row" layerID="' + layerID + '" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="img/parkingmeters.png"></td><td class="feature-name">' + layer.feature.properties.LOCATION +" , "+layer.feature.properties.METER_ID+ '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');

					}
				}
			});
			$.get("https://luyuliu.github.io/CURIO-Map/data/Medical_Facilities.json", function (data) {
				medicalFullLayer.addData(data);
				medicalLayer.addLayer(medicalFullLayer)
				map.addLayer(medicalLayer);
			});
			flagList[layerID] = 2;


			break;

			/*		case "bikeshr_zgst":
						/* ZAGSTER Layer Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
			/*			bikeshr_zgstLayer = new L.markerClusterGroup({
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
			*/


		default:
			//user's custom layers
			//"JSON Points"
			//"JSON Polyline/Polygon"
			//"GeoServer tiles"
			if (typeof (URL) == "undefined") {
				var URL = fullLayerFlags.getURLByLayerID(layerID);
			}
			if (typeof (featureType) == "undefined") {
				var featureType = fullLayerFlags.getFeatureTypeByLayerID(layerID);
			}
			if (typeof (dataType) == "undefined") {
				var dataType = fullLayerFlags.getDataTypeByLayerID(layerID)
			}
			//console.log(layerID, dataType, URL, symbolType, jsonp, acolor)
			if (dataType == 7) {
				jsonp = [grades, colors, variables];
			}
			addDefaultHandles(layerID, dataType, URL, symbolType, jsonp, acolor);
			flagList[layerID] = 1;


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
	//console.log(layerID, dataType, URL, symbolType, jsonp, acolor)
	icons = fullLayerFlags.getItemByLayerID(layerID).icon
	addLegendHandle(layerID, URL + "/legend", grades, colors, dataType, icons, acolor);
	console.log("dataType: " + dataType)
	console.log("URL: " + URL)
	console.log("layerID: " + layerID)
	console.log("Done.")

	$("#loading").hide();

}