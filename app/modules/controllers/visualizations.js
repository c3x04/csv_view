'use strict';
var moment = require('moment');
angular.module('app')
	.controller('chartController', function($scope, $mdToast, $timeout, sharedData, Downtime) {
		$scope.fromDate; // on change events should trigger graph updates
		$scope.toDate;
		$scope.ipSelect = "SWITCH AT BRPL [10.152.0.234]";
		$scope.data = sharedData.getData();
		console.log(moment('2016-11-23').isBetween('2016-11-22', '2016-10-30', 'day', '[]'));
		$scope.$watch('[fromDate, toDate]', function() {
			if($scope.ipSelect !== undefined) {
				if(($scope.fromDate !== undefined && $scope.toDate === undefined) 
					|| ( moment($scope.fromDate).isSame($scope.toDate) )) {
					// Use momentjs and set the tableData
					// Change the options to line graph
					$scope.options = {
						chart: {
							type: 'lineChart',
							height: 450,
							margin : {
								top: 20,
								right: 20,
								bottom: 40,
								left: 55
							},
							x: function(d){ return d.x; },
							y: function(d){ return d.y; },
							useInteractiveGuideline: true,
							xAxis: {
								axisLabel: 'Time (hr)'
							},
							yAxis: {
								axisLabel: 'Down'
							},
						}
					};
					// TODO: Change X:axis ticks to time
					var x = [];
					for (var i = 0; i <= 1440; i++) {
						x[i] = 0;
					}
					$scope.chartData = [{
						color: 'black',
						key: "Downtime",
						values: [ {"x":0,"y":0}, {"x":1, "y":0}, {"x":1,"y":1}, {"x":2,"y":1}, {"x":2,"y":0}, {"x":3,"y":0}, {"x":4,"y":0}, {"x":5,"y":0} ]
					}];
				} else if($scope.fromDate !== undefined && $scope.toDate !== undefined) {
					// moment('2016-10-30').isBetween('2016-10-30', '2016-10-30', 'day', '[]'); //true
					// Use momentjs and set the tableData
					// Change the options to bar graph
					$scope.options = { // based on fromDate and toDate this will change
						chart: {		// TODO: Remove unnecessary configs
							type: 'historicalBarChart',
							height: 450,
							margin : {
								top: 20,
								right: 20,
								bottom: 65,
								left: 50
							},
							x: function(d){return d[0];}, // TODO: Change based on data
							y: function(d){return d[1];}, // TODO: Change based on data
							showValues: true,
							valueFormat: function(d){
								return d3.format(".1f")(d);
							},
							duration: 1000,
							xAxis: {
								axisLabel: 'Date',
								tickFormat: function(d) {
									return d3.time.format('%x')(new Date(d))
								},
								rotateLabels: 0,
								showMaxMin: false
							},
							yAxis: {
								axisLabel: 'Downtime Percent',
								axisLabelDistance: -10,
								tickFormat: function(d){
									return d3.format(".1f")(d);
								}
							},
							useInteractiveGuideline: true,
							// Format: Date: <date>
							//		   <time> to <time>
							//		   <time> to <time>
							tooltip: {
								contentGenerator: function(d) { 	
									var date = d3.time.format('%x')(new Date(d.data[0]));
									return '<b>Date: '+date+'</b>';
								}
							},
							bars: {
								dispatch: {
									renderEnd: function() {
										d3.selectAll("rect.nv-bar").style("fill", function(d, i){
											return d[1] > 30 ? "red":"green";
										});
									}
								}
							},
							zoom: {
								enabled: true,
								scaleExtent: [1, 10],
								useFixedDomain: false,
								useNiceScale: false,
								horizontalOff: false,
								verticalOff: true,
								unzoomEventType: 'dblclick.zoom'
							}
						}
					};
					var _values = [];
					var valuesDict = {}
					angular.forEach($scope.data[$scope.ipSelect].value, function(element) {
						var time = new Date(element.time.toDateString()).getTime();
						if(valuesDict[time] === undefined) {
							valuesDict[time] = new Downtime('0h 0m');
						}
						valuesDict[time].add(element.downtime);
					});
					Object.keys(valuesDict).forEach(function(key){
						_values.push([parseInt(key), valuesDict[key].percent()])
					});
					console.log(Object.keys(valuesDict));
					console.log(_values);
					_values = _values.sort();
					$scope.chartData = [ // get Data from sharedData service and use Downtime service 
									//to calc downtime percent
							{
								"values" : _values
							}
					];
				}
			}
		}, true);
	});
