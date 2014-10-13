/**
 * Application Controller
 * Global Level variable and function
 */

app.controller('ApplicationCtrl', function ($scope, $rootScope, $modal, User) {
  
  $rootScope.$on('AUTH_LOGIN', function(e, user) {
    $rootScope.currentUser = user.user
  });

  $rootScope.$on('AUTH_LOGOUT', function (d, data) {
    login()
  })
  
  var login = function () {
    var modalInstance = $modal.open({
      templateUrl: 'partials/login-form.html',
      controller: LoginModalInstanceCtrl,
      size: 'sm',
      backdrop: false,
      keybaord: false
    });

    modalInstance.result.then(function (user) {
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });
  }
  
  $scope.logout = function () {
    $rootScope.$broadcast('AUTH_LOGOUT')
  }

  User.getCurrent(function (user) {
    $rootScope.currentUser = user
  }, function () {
    $rootScope.$broadcast('AUTH_LOGOUT')
  })
  
})

var LoginModalInstanceCtrl = function ($scope, $modalInstance, $rootScope, User) {

  $scope.credentials = {
    username: '13357828347',
    password: '123456'
  };
  $scope.tryLogin = function (credentials) {
    User.login($scope.credentials, function (user) {
      $rootScope.$broadcast('AUTH_LOGIN', user);
      $modalInstance.close(user);
    }, function () {
      $rootScope.$broadcast('AUTH_LOGOUT');
    })
  } 
}
