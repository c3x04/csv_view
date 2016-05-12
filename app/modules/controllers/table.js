'use strict';
var xls = require('node-simple-xlsx');
angular.module('app')
	.controller('tableController', function($scope, $mdToast, $timeout, $location, sharedData) {
		$scope.openChart = function() {
			$location.path('/visualizations');
		};
		var csvData = sharedData.getData();
		$scope.query = {
			order: 'name',
			limit: 5,
			page: 1
		};
		$scope.getFakeProgress =  function() {
			$scope.promise = $timeout(function () {}, 1000);
		};
		$timeout(function () {
			$scope.tableHead = csvData[0];
			$scope.data = csvData.slice(1);
			$scope.createXLSX = function() {
				$mdToast.show($mdToast.simple({position: 'right'}).content('Please wait creating xlsx file'));
				$timeout(function () {
					var writer = new xls();
					writer.setHeaders(csvData[0]);
					for (var i = 1; i<csvData.length - 1; i++) {
						writer.addRow(csvData[i]);
					}
					writer.pack('test.xlsx', function (err) {
		    			if (err) {
		        			console.log('Error: ', err);
		    			} else {
							$mdToast.show($mdToast.simple({position: 'right'}).content('Done'));
						}
					});
				}, 1000);
			}
		}, 1000);
	})