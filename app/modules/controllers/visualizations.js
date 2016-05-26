'use strict';
var moment = require('moment');
angular.module('app')
	.controller('chartController', function($scope, $mdToast, $timeout, sharedData, Downtime) {
		$scope.fromDate; // on change events should trigger graph updates
		$scope.toDate;
		$scope.ipSelect = "SWITCH AT BRPL [10.152.0.234]";
		$scope.data = sharedData.getData();
		console.log(moment('2016-11-23').isBetween('2016-11-22', '2016-10-30', 'day', '[]'));
		$scope.$watch('[fromDate, toDate, ipSelect]', function() {
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
								axisLabel: 'Time (hr)',
								tickFormat: function(d){
									return d3.time.format("%X")(new Date(d));
								}
							},
							yAxis: {
								axisLabel: 'Down',
								tickFormat: function(d){
									return d3.format("%d")(d);
								}
							},
						}
					};
					var _data = [
						{
							"color": 'grey',
							"key": 'Downtime',
							"values": []
						}
					];
					angular.forEach($scope.data[$scope.ipSelect].value, function(element) {
						var time = new Date(element.time.toDateString()).getTime();
						var _y = moment(time).subtract(element.downtime.time, 'minutes');
						_data[0].values.push({"x": time, "y":_y, "size": 0.57});
					});
					$scope.chartData = [{
						color: 'grey',
						key: "Downtime",
						values: [ {"x":1463716231327,"y":0}, {"x":1463716231327, "y":0}, {"x":1473716231327,"y":1}, {"x":1483716231327,"y":1}, {"x":1493716231327,"y":0} ]
					}];
				} else if($scope.fromDate !== undefined && $scope.toDate !== undefined) {
					// moment('2016-10-30').isBetween('2016-10-30', '2016-10-30', 'day', '[]'); //true
					// Use momentjs and set the tableData
					// Change the options to bar graph
					$scope.options = {
						chart: {
							type: 'scatterChart',
							height: 450,
							color: d3.scale.category10().range(),
							scatter: {
								onlyCircles: true
							},
							showDistX: true,
							showDistY: true,
							tooltipContent: function(key) {
								return '<h3>' + key + '</h3>';
							},
							duration: 350,
							xAxis: {
								axisLabel: 'Date',
								tickFormat: function(d) {
									return d3.time.format('%d-%B-%Y')(new Date(d));
								},
								showMaxMin: true
							},
							yAxis: {
								axisLabel: 'Downtime',
								axisLabelDistance: -5,
								tickFormat: function(d){
									return d3.time.format('%H:%M')(new Date(d));
								}
							},
							zoom: {
								enabled: true,
								scaleExtent: [1, 10],
								useFixedDomain: false,
								useNiceScale: false,
								horizontalOff: false,
								verticalOff: false,
								unzoomEventType: 'dblclick.zoom'
							}
						}
					}
					var _data = [
						{
							"key": "Downtime",
							"color": 'red',
							"values":[]
						}
					];
					angular.forEach($scope.data[$scope.ipSelect].value, function(element) {
						var time = new Date(element.time.toDateString()).getTime();
						var _y = moment(time).subtract(element.downtime.time, 'minutes');
						_data[0].values.push({"x": time, "y":_y, "size": 0.57});
					});
					$scope.chartData = _data;
					// _values = _values.sort();
					// $scope.chartData = [ // get Data from sharedData service and use Downtime service 
					// 				//to calc downtime percent
					// 		{
					// 			color: '#ff7f0e',
					// 			"values" : _values
					// 		}
					// ];
				}
			}
		}, true);
	});
