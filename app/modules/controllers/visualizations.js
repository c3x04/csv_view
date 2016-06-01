'use strict';
var moment = require('moment');
angular.module('app')
	.controller('chartController', function($scope, $mdToast, $timeout, sharedData, Downtime) {
		$scope.fromDate;
		$scope.toDate;
		$scope.ipSelect = "SWITCH AT BRPL [10.152.0.234]";
		$scope.data = sharedData.getData();
		$scope.$watch('[fromDate, toDate, ipSelect]', function() {
			if($scope.ipSelect !== undefined) {
				if($scope.fromDate !== undefined && $scope.toDate !== undefined) {
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
							tooltip: {
								contentGenerator: function(d) {
									return '<h3><b>Downtime</b></h3>' +
									'<p><b style="color:grey;">' + d3.time.format('%d-%B-%Y')(d.point.up) + '</b><p>' +
									'<p>'+ d3.time.format('%I:%M %p')(d.point.down) + ' to ' + d3.time.format('%I:%M %p')(d.point.up) + '</p>';
								}
							},
							duration: 350,
							xAxis: {
								axisLabel: 'Date',
								tickFormat: function(d) {
									return d3.time.format('%d-%B-%Y')(new Date(d));
								},
								showMaxMin: true
							},
							useInteractiveGuideline: false,
							yAxis: {
								axisLabel: 'Downtime',
								axisLabelDistance: -5,
								tickFormat: function(d){
									return d3.time.format('%I:%M %p')(new Date(d));
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
						var _fromDate = $scope.fromDate.toDateString();
						var _toDate = $scope.toDate.toDateString();
						if(moment(element.up.toDateString()).isBetween(_fromDate, _toDate, 'day', '[]') == true) {
							var _x = new Date(element.up.toDateString()).getTime();
							var _y = element.down.getTime();
							_data[0].values.push({"x": _x, "y":_y, "size": (element.downtime.percent() / 100), "down": element.down, "up": element.up});
						}
					});
					console.log(_data);
					$scope.chartData = _data;
				}
			}
		}, true);
	});
