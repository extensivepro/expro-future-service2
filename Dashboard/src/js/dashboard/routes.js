'use strict';

/**
 * Route configuration for the Dashboard module.
 */
app.config(function($stateProvider, $urlRouterProvider, USER_ROLES) {
  // For unmatched routes
  $urlRouterProvider.otherwise('/');

  // Application routes
  $stateProvider
    .state('index', {
      url: '/',
      templateUrl: 'partials/dashboard.html',
      data: {
        authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
      }
    })
    .state('merchants', {
      url: '/merchants', 
      templateUrl: 'partials/merchants.html'
    })
    .state('members', {
      url: '/members',
      templateUrl: 'partials/members.html'
    })
    .state('shops', {
      url: '/shops',
      templateUrl: 'partials/shops.html'
    })
    .state('employes', {
      url: '/employes',
      templateUrl: 'partials/employes.html'
    })
    .state('points', {
      url: '/points',
      templateUrl: 'partials/points.html'
    })
    .state('items', {
      url: '/items',
      templateUrl: 'partials/items.html'
    })
    .state('bills', {
      url: '/bills',
      templateUrl: 'partials/bills.html'
    })
    .state('accounts', {
      url: '/accounts',
      templateUrl: 'partials/accounts.html'
    })
    .state('deals', {
      url: '/deals',
      templateUrl: 'partials/deals.html'
    })
});
