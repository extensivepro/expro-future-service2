var app = angular.module('Dashboard', ['ui.utils', 'ui.bootstrap', 'ui.router', 'ngCookies', 'ngResource', 'ngMorph']).
config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.withCredentials = true
}])