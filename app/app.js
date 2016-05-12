'use strict';

var angular = require('angular');
require('angular-route');
require('angular-material');
require('d3');
require('angular-nvd3');
require('nvd3');
var _templateBase = './templates';

var app = angular.module('app', [require('angular-material-data-table'), 'nvd3', 'ngRoute', 'ngAnimate', 'lfNgMdFileInput', 'ngMaterial']);

var index = require('./modules/index');

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
  return {
    getData: function() {
      return data;
    },
    setData: function(obj) {
      data = obj;
    }
  }
});