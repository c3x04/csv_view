'use strict';
var csvParser = require('babyparse');
angular.module('app')
	.controller('indexController', function($scope, $location, $mdToast, $timeout, sharedData) {
		$mdToast.show($mdToast.simple({position: 'top'}).content('Select CSV file to view Data'));
		$scope.$watch('files.length',function(newVal, oldVal){
			if (newVal === 1) {
				var parsed = csvParser.parseFiles($scope.files[0].lfFile.path,  {
					complete: function(results) {
						sharedData.setData(results.data);
						$timeout(function () {
							$location.path('/table');
						}, 1000);
					}
				});
			}
        });
		$scope.openChart = function() {
			$location.path('/visualizations');
		};
	});
