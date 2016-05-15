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
		var tData = {};
		var regex_Location = /\[IPCheck\](.*?)\[/;
		var regex_Downtime = /\[Downtime:(.*?)\]/;
		csvData.slice(0, csvData.length - 1).forEach( function(item){
				var location = regex_Location.exec(item[0])[1].trim();
				if(tData[location] === undefined) {
					tData[location] = []
				}
				tData[location].push({
					'time': item[1].trim(),
					'downtime': regex_Downtime.exec(item[0])[1].trim()
				});
			});
		console.log(tData);
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