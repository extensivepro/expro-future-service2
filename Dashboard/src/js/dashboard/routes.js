'use strict';

/**
 * Route configuration for the Dashboard module.
 */
angular.module('Dashboard').config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider) {

    // For unmatched routes
    $urlRouterProvider.otherwise('/');

    // Application routes
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'partials/dashboard.html'
        })
        .state('members', {
            url: '/members',
            templateUrl: 'partials/members.html'
        })
        .state('tables', {
            url: '/tables', 
            templateUrl: 'partials/tables.html'
        });
}]);
