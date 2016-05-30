'use strict';

var angular = require('angular');
require('angular-route');
require('angular-material');
require('d3');
require('angular-nvd3');
require('nvd3');
require('angular-material-icons')
var _templateBase = './templates';

var app = angular.module('app', [require('angular-material-data-table'), 'ngMdIcons', 'nvd3', 'ngRoute', 'ngAnimate', 'lfNgMdFileInput', 'ngMaterial']);

var index = require('./modules/index');
app.controller('menuCtrl', function($scope, $location) {
	$scope.goHome = function() {
		$location.path('/');
    };
});
app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
	templateUrl: _templateBase + '/index.html',
	controller: 'indexController',
	});
	$routeProvider.when('/table', {
	templateUrl: _templateBase + '/table.html',
	controller: 'tableController',
	});

	$routeProvider.when('/visualizations', {
	templateUrl: _templateBase + '/visualizations.html',
	controller: 'chartController',
	});

	$routeProvider.otherwise({ redirectTo: '/' });

}]);
app.service('sharedData', function() {
	var data = [];
	var inActData = [];
	var actData = [];
	return {
		getData: function() {
			return data;
		},
		setData: function(obj) {
			data = obj;
		},
		getInActData: function() {
			return inActData;
		},
		setInActData: function(obj) {
			inActData = obj;
		},
		getActData: function() {
			return actData;
		},
		setActData: function(obj) {
			actData = obj;
		}
	}
});
app.service('Downtime', function() {
	var Downtime = function(time) {
		var re_hr = /\d+(?=h)/;
		var re_min = /\d+(?=m)/;
		var _hours = parseInt(re_hr.exec(time)[0]);
		var _min = parseInt(re_min.exec(time)[0]);
		this.time = _min + (_hours * 60);
	};
	Downtime.prototype.add = function(duration) {
		this.time = this.time + duration.time; 
	};
	Downtime.prototype.divide = function(duration) {
		if(duration.time !== 0) {
		this.time = this.time / duration.time;
		}
	}
	Downtime.prototype.percent = function() {
		return ((this.time / 1440) * 100).toPrecision(3);
	}
	return Downtime;
})