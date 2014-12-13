/**
 * Application Controller
 * Global Level variable and function
 */

app.controller('ApplicationCtrl', function ($scope, $rootScope, $modal, User, CurrentEmploye) {
  
  $rootScope.$on('AUTH_LOGIN', function(e, user) {
    CurrentEmploye.setCurrentEmploye(user.user)
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
    })

    modalInstance.result.then(function (user) {
    }, function () {
      console.info('Modal dismissed at: ' + new Date())
    })
  }
  
  $scope.logout = function () {
    User.logout(function () {
      $rootScope.$broadcast('AUTH_LOGOUT')
    })
  }

  User.getCurrent(CurrentEmploye.setCurrentEmploye, function () {
    $rootScope.$broadcast('AUTH_LOGOUT')
  })
  
  $scope.showProfile = function () {
    var modalInstance = $modal.open({
      templateUrl: 'partials/profile.html',
      controller: ProfileModalInstanceCtrl,
      size: 'md',
      backdrop: false,
      keybaord: false
    })

    modalInstance.result.then(function (user) {
    }, function () {
      console.info('Modal dismissed at: ' + new Date())
    })
  }
  
  $scope.showResetPassword = function () {
    var modalInstance = $modal.open({
      templateUrl: 'partials/reset-password.html',
      controller: ResetPasswordModalInstanceCtrl,
      size: 'sm'
    })

    modalInstance.result.then(function (user) {
    }, function () {
      console.info('Modal dismissed at: ' + new Date())
    })
  }
  
})

var LoginModalInstanceCtrl = function ($scope, $modalInstance, $rootScope, User) {

  $scope.credentials = {
    realm: 'employe.13357828347',
    username: '13357828347',
    password: '123456'
  }
  
  $scope.alerts = []
	
  $scope.tryLogin = function (credentials) {
    $scope.alerts = []
    User.login(credentials, function (user) {
      $rootScope.$broadcast('AUTH_LOGIN', user);
      $scope.alerts.push({type: 'success', msg: '登陆成功'})
      $modalInstance.close(user);
    }, function (res) {
      $scope.alerts.push({type: 'danger', msg: '用户名或密码不正确！'})
    })
  }
  
  $scope.tryRegister = function (credentials) {
    $scope.alerts = []
    credentials.name = credentials.username+'@'+credentials.realm
    credentials.email = credentials.username+"@example.com"
    User.create(credentials,function (user) {
      $scope.alerts.push({type: 'success', msg: '注册成功'})
      $scope.tryLogin(credentials)
    }, function (res) {
      $scope.alerts.push({type: 'danger', msg: '注册用户失败'})      
    })
  } 
}

var ProfileModalInstanceCtrl = function ($scope, $modalInstance, $rootScope, User) {
  
}

var ResetPasswordModalInstanceCtrl = function ($scope, $modalInstance, $rootScope, User) {
  $scope.credentials = {}
  
  $scope.resetPassword = function (credentials) {
    $scope.alerts = []

    if (credentials.password !== credentials.password2) {
      return $scope.alerts.push({type: 'danger', msg: '两次输入的密码不一致'})      
    }
    
    User.upsert({
      id: $scope.currentUser.id,
      password: credentials.password
    }, function (user) {
      $modalInstance.close()
    }, function (res) {
      $scope.alerts.push({type: 'danger', msg: '更新用户密码失败'})      
    })
  }
}