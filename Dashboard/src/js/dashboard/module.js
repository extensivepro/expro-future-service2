var app = angular.module('Dashboard', ['ui.utils', 'ui.bootstrap', 'ui.router', 'ngCookies', 'ngMorph', 'expro-future2.services'])
.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.withCredentials = true
}])

.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
})
