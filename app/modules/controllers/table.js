'use strict';
var xls = require('node-simple-xlsx');
var ipc = require('ipc');
var remote = require('remote'); 
var dialog = remote.require('dialog'); 
angular.module('app')
	.controller('tableController', function($scope, $mdToast, $timeout, $location, sharedData) {
		$scope.openChart = function() {
			$location.path('/visualizations');
		};
		var csvData = sharedData.getData().map( function(item) { 
					return item.slice(4,6)
				});
		var regex_Location = /\[IPCheck\](.*?)\[D/;
		var regex_Downtime = /\[Downtime:(.*?)\]/;
		var tData = {};
		var arrTData = [];
		csvData.slice(0, csvData.length - 1).forEach( function(item){
				var IPlocation = regex_Location.exec(item[0])[1].trim();
				if(tData[IPlocation] === undefined) {
					tData[IPlocation] = {};
					tData[IPlocation].value = [];
					tData[IPlocation].location = IPlocation;
				}
				tData[IPlocation].value.push({
					'time': item[1].trim(),
					'downtime': regex_Downtime.exec(item[0])[1].trim()
				});
			});
		angular.forEach(tData, function(element) {
			arrTData.push(element);
		});
		$scope.getFakeProgress =  function() {
			$scope.promise = $timeout(function () {}, 1000);
		};
		$timeout(function () {
			$scope.tableHead = ['IP/Location', 'Time', 'Downtime'];
			$scope.data = arrTData;
			$scope.getFakeProgress();
			$scope.ipSelect = '';
			$scope.filter = '';
			$scope.filterOpt = ['Day', 'Month', 'Year', 'Custom'];
			$scope.downtimePercent = 92.2;
			$scope.createXLSX = function() {
				$mdToast.show($mdToast.simple({position: 'right'}).content('Please wait creating xlsx file'));
    			var fileName = dialog.showSaveDialog(
    				{
    				  title: "Test",
					  filters: [
					    {name: 'XLSX', extensions: ['xls', 'xlsx']},
					    {name: 'All Files', extensions: ['*']}
					  ]
					}
    			);
				$timeout(function () {
					var writer = new xls();
					writer.setHeaders(csvData[0]);
					for (var i = 1; i<csvData.length - 1; i++) {
						writer.addRow(csvData[i]);
					}
					writer.pack(fileName, function (err) {
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