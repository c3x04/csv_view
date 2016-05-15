'use strict';
angular.module('app')
	.controller('chartController', function($scope, $mdToast, $timeout, sharedData) {
		// Chart Data
		 $scope.options = {
			chart: {
				type: 'multiBarChart',
				height: 450,
				margin : {
					top: 20,
					right: 20,
					bottom: 45,
					left: 45
				},
				clipEdge: true,
				duration: 500,
				stacked: true,
				xAxis: {
					axisLabel: 'Day',
					showMaxMin: false,
					tickFormat: function(d){
						return d3.format(',f')(d);
					}
				},
				yAxis: {
					axisLabel: 'Time (hr)',
					axisLabelDistance: -20,
					tickFormat: function(d){
						return d3.format(',.1f')(d);
					}
				}
			}
		};

		$scope.data = [
				{
					"key":"Stream0",
					"values":[
						{
							"x":0,
							"y":4
						},
						{
							"x":1,
							"y":6
						},
						{
							"x":2,
							"y":8
						}
					]
				},
				{
					"key":"Stream1",
					"values":[
						{
							"x":0,
							"y":6
						},
						{
							"x":1,
							"y":9
						},
						{
							"x":2,
							"y":14
						}
					]
				},
				{
					"key":"Stream2",
					"values":[
						{
							"x":0,
							"y":17
						},
						{
							"x":1,
							"y":12
						},
						{
							"x":2,
							"y":24
						}
					]
				}
			];

	});
