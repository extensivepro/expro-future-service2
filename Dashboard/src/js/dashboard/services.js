'use strict';

/* Services */

var baseURL = 'http://service.fankahui.com:3000/api'

angular.module('expro-future2.services', ['lbServices'])
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
  .factory('AuthService', function (User) {
    var authService = {
      currentUser: null,
      isAuthenticated: function () {
        return !!this.currentUser;
      },
      isAuthorized: function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
          authorizedRoles = [authorizedRoles];
        }
        return (this.isAuthenticated());//Just for test
        return (this.isAuthenticated() &&
          authorizedRoles.indexOf(Session.userRole) !== -1);
      },
      login: function (credentials, successCB, failureCB) {
        var theSelf = this;
        User.login({include: 'user', rememberMe: true}, credentials, function (user) {
          theSelf.currentUser = user;
          successCB(user);
        }, failureCB);
      },
      ensureHasCurrentUser: function() {
        if (this.currentUser) {
          console.log('Using cached current user.');
        } else {
          console.log('Fetching current user from the server.');
          this.currentUser = User.getCurrent(function() {
            // success
          }, function(response) {
            console.log('User.getCurrent() err', arguments);
          });
        }
      }
    };
 
    return authService;
  })
  .run(function ($rootScope, AUTH_EVENTS, AuthService, User) {
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
  