'use strict';
var moment = require('moment');
angular.module('app')
	.controller('chartController', function($scope, $mdToast, $timeout, sharedData) {
		$scope.fromDate; // on change events should trigger graph updates
		$scope.toDate;
		$scope.ipSelect = '';
		$scope.data = sharedData.getData();
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
					axisLabel: 'X Axis',
					tickFormat: function(d) {
						return d3.time.format('%x')(new Date(d))
					},
					rotateLabels: 0,
					showMaxMin: false
				},
				yAxis: {
					axisLabel: 'Y Axis',
					axisLabelDistance: -10,
					tickFormat: function(d){
						return d3.format(".1f")(d);
					}
				},
				// Format: Date: <date>
				//		   <time> to <time>
				//		   <time> to <time>
				tooltip: {
					contentGenerator: function(d) { 	
						var date = d3.time.format('%x')(new Date(d.data[0]));
						return '<b>Date: '+date+'</b>';
					}
				},
				dispatch: {
					renderEnd: function() {
						d3.selectAll("rect.nv-bar").style("fill", function(d, i){
							return d[1] > 30 ? "red":"green";
	    				});
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

		$scope.chartData = [ // get Data from sharedData service and use Downtime service 
						//to calc downtime percent
			{
				"values" : [ [ 1136005200000 , 12.9] , [ 1138683600000 , 13.8] , [ 1141102800000 , 4.05] , [ 1143781200000 , 0] , [ 1146369600000 , 99.2] , [ 1149048000000 , 0.0] , [ 1151640000000 , 55.2] , [ 1154318400000 , 12.4] , [ 1156996800000 , 10.2] , [ 1159588800000 , 38.0]]    
			}];
	});
