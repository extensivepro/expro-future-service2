/**
 * Application Controller
 * Global Level variable and function
 */

app.controller('ApplicationCtrl', function ($scope, $modal, AuthService, AUTH_EVENTS) {
  
  AuthService.ensureHasCurrentUser();

  $scope.$on(AUTH_EVENTS.loginSuccess, function (user) {
    console.log('AUTH_EVENTS.loginSuccess------', user)
  })

  $scope.$on(AUTH_EVENTS.notAuthorized, function (d, data) {
    console.log('AUTH_EVENTS.notAuthorized------')
  })

  $scope.$on(AUTH_EVENTS.notAuthenticated, function (d, data) {
    console.log('AUTH_EVENTS.notAuthenticated======', d, data)
    login()
  })
  
  var login = function () {
    var modalInstance = $modal.open({
      templateUrl: 'partials/login-form.html',
      controller: LoginModalInstanceCtrl,
      backdrop: false,
      keybaord: false
    });

    modalInstance.result.then(function (user) {
      console.log('--------user------',user)
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });
  }
})

var LoginModalInstanceCtrl = function ($scope, $modalInstance, $rootScope, AUTH_EVENTS, AuthService) {

  $scope.credentials = {
    username: '',
    password: ''
  };
  $scope.login = function (credentials) {
    AuthService.login(credentials, function (user) {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      $modalInstance.close(user);
    }, function () {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    });
  } 
};
