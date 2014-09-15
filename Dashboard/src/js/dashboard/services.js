'use strict';

/* Services */

var baseURL = 'http://service.fankahui.com:3000/api'

angular.module('expro-future2.services', ['lbServices'])
  .service('Session', function () {
    this.create = function (sessionId, userId, userRole) {
      this.id = sessionId;
      this.userId = userId;
      this.userRole = userRole;
    };
    this.destroy = function () {
      this.id = null;
      this.userId = null;
      this.userRole = null;
    };
    return this;
  })
  .factory("Merchants", function ($resource) {
    return $resource(baseURL + '/merchants/:merchantID', {merchantID: '@_id'}, {
      update: { method: 'PUT' } 
    })
  })
  .factory("Members", function ($resource) {
    return $resource(baseURL + '/members/:memberID', {memberID: '@_id'}, {
      update: { method: 'PUT' } ,
      count: { method: 'GET' , params: {memberID: 'count'}}
    })
  })
  .factory("Shops", function ($resource) {
    return $resource(baseURL + '/shops/:shopID', {shopID: '@_id'}, {
      update: { method: 'PUT' } 
    })
  })
  .factory('AuthService', function (Session) {
    var authService = {};
 
    authService.login = function (credentials) {
      return $http
        .post('/login', credentials)
        .then(function (res) {
          Session.create(res.data.id, res.data.user.id,
                         res.data.user.role);
          return res.data.user;
        });
    };
 
    authService.isAuthenticated = function () {
      return !!Session.userId;
    };
 
    authService.isAuthorized = function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (authService.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRole) !== -1);
    };
 
    return authService;
  })
  .run(function ($rootScope, AUTH_EVENTS, AuthService) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
      if (!next.data || !next.data.authorizedRoles) return;
      
      var authorizedRoles = next.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (AuthService.isAuthenticated()) {
          // user is not allowed
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        } else {
          // user is not logged in
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        }
      }
    });
  })
  