'use strict';

/* App Module */

var app = angular.module('493FinalProj', [
  'ngRoute',
  'Final_Controllers'
]);


app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/homepage.html',
        controller: 'searchPage'
      }).
      when('/mytrips', {
        templateUrl: 'partials/mytrips.html',
        controller: 'searchPage'
      }).
      when('/addtrip', {
        templateUrl: 'partials/addtrip.html',
        controller: 'searchPage'
      }).
       when('/tripagenda', {
        templateUrl: 'partials/tripagenda.html',
        controller: 'searchPage'
      }).
       when('/searchresults', {
        templateUrl: 'partials/searchresults.html',
        controller: 'searchPage'
      }).
       when('/map', {
        templateUrl: 'partials/map.html',
        controller: 'searchPage'
      }).
      otherwise({
        redirectTo: '/404'
      });
  }]);
