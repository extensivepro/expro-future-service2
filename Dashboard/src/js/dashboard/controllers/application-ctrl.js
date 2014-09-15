/**
 * Application Controller
 * Global Level variable and function
 */

app.controller('ApplicationCtrl', function ($scope, $modal, USER_ROLES, AuthService, AUTH_EVENTS) {
  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;
 
  $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;
  };
  
  $scope.$on(AUTH_EVENTS.notAuthorized, function (d, data) {
    console.log('AUTH_EVENTS.notAuthorized------')
  })

  $scope.$on(AUTH_EVENTS.notAuthenticated, function (d, data) {
    console.log('AUTH_EVENTS.notAuthenticated======')
    login()
  })
  
  var login = function () {
    var modalInstance = $modal.open({
      templateUrl: 'partials/login-form.html',
      controller: LoginModalInstanceCtrl,
      backdrop: false,
      keybaord: false
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }
})

var LoginModalInstanceCtrl = function ($scope, $modalInstance, $rootScope, AUTH_EVENTS, User, AuthService) {

  $scope.credentials = {
    username: '',
    password: ''
  };
  $scope.login = function (credentials) {
    User.login({include: 'user', rememberMe: true}, $scope.credentials, function (user) {
      console.log('======user======', user)
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      $scope.setCurrentUser(user);
    }, function () {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    });
  };
};
