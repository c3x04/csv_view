'use strict';
var xls = require('node-simple-xlsx');
var remote = require('remote'); 
var dialog = remote.require('dialog');
var moment = require('moment');
angular.module('app')
	.controller('tableController', function($scope, $mdToast, $timeout, $location, sharedData, Downtime) {
		$scope.openChart = function() {
			$location.path('/visualizations');
		};
		$scope.fromDate;
		$scope.toDate;
		$scope.dateFilter = function(data) {
			if($scope.fromDate === undefined && $scope.toDate === undefined) {
				return true;
			}
			var _fromDate = $scope.fromDate.toDateString();
			var _toDate = $scope.toDate.toDateString();
			if(moment(data.up.toDateString()).isBetween(_fromDate, _toDate, 'day', '[]') == true) {
				return true;
			}
			return false;
		};
		var csvData = sharedData.getData().map( function(item) { 
					return item.slice(4,6)
				});
		var regex_Index = /\[IPCheck\](.*?)\[D/;
		var regex_Downtime = /\[Downtime:(.*?)\]/;
		var regex_Location = /(.*?)\[\d/;
		var regex_IP = /\[\d+.\d+.\d+.\d+\]/;
		var tData = {};
		var arrTData = [];
		csvData.slice(0, csvData.length - 1).forEach( function(item){
				var index = regex_Index.exec(item[0])[1].trim();
				if(tData[index] === undefined) {
					tData[index] = {};
					tData[index].value = [];
					tData[index].index = index;
					tData[index].location = regex_Location.exec(index)[1].trim();
					tData[index].ip = regex_IP.exec(index)[0].split(/\[|\]/).join("");
				}
				var _downtime = new Downtime(regex_Downtime.exec(item[0])[1].trim())
				var _up = new Date(item[1].trim())
				tData[index].value.push({
					'up': _up,
					'down': moment(_up).subtract(_downtime.time, 'minutes').toDate(),
					'downtime': _downtime
				});
			});
		sharedData.setData(tData);
		angular.forEach(tData, function(element) {
			arrTData.push(element);
		});
		$scope.getFakeProgress =  function() {
			$scope.promise = $timeout(function () {}, 1000);
		};
		
		$timeout(function () {
			$scope.tableHead = ['Location', 'IP', 'Up', 'Down', 'Downtime'];
			$scope.data = arrTData;
			$scope.getFakeProgress();
			$scope.ipSelect = '';
			$scope.filter = '';
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