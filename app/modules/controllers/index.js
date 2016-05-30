'use strict';
var csvParser = require('babyparse');
angular.module('app')
	.controller('indexController', function($scope, $location, $mdToast, $timeout, sharedData) {
		$mdToast.show($mdToast.simple({position: 'top'}).content('Select CSV file to view Data'));
		var flgActFile = false;
		var flgInActFile = false;
		$scope.$watch('fileInAct.length',function(newVal, oldVal){
			if (newVal === 1) {
				var parsed = csvParser.parseFiles($scope.fileInAct[0].lfFile.path,  {
					complete: function(results) {
						sharedData.setInActData(results.data);
						flgInActFile = true;
						if (flgActFile === true && flgInActFile === true) {
							$timeout(function () {
								$location.path('/table');
							}, 1000);
						}
					}
				});
			}
        });
        $scope.$watch('fileAct.length',function(newVal, oldVal){
			if (newVal === 1) {
				var parsed = csvParser.parseFiles($scope.fileAct[0].lfFile.path,  {
					complete: function(results) {
						sharedData.setActData(results.data);
						sharedData.setData(results.data);
						flgActFile = true;
						if (flgActFile === true && flgInActFile === true) {
							$timeout(function () {
								$location.path('/table');
							}, 1000);
						}
					}
				});
			}
        });
		$scope.openChart = function() {
			$location.path('/visualizations');
		};
	});
