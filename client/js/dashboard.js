(function(){ 
'use strict';

/* Services */

angular.module('expro-future2.services', ['lbServices'])  
var app = angular.module('Dashboard', ['ui.utils', 'ui.bootstrap', 'ui.router', 'ngCookies', 'ngMorph', 'expro-future2.services'])
.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.withCredentials = true
}])
.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
})

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
});

/**
 * Application Controller
 * Global Level variable and function
 */

app.controller('ApplicationCtrl', function ($scope, $modal, AUTH_EVENTS) {
  
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

/**
 * List Controller
 */
app.controller('ListCtrl', function ListCtrl($scope) {
  $scope.entities = []
  $scope.resource = undefined
  $scope.orderOptions = ['createdAt DESC']
  $scope.search = {
    text: '',
    orFields: ['name', 'phone'],
  }
  $scope.includes = []

  $scope.fetch = function () {
    var filter = { 
      order: $scope.orderOptions,
      limit: 20
    }
    if($scope.search.text !== '' && $scope.search.orFields.length > 0) {
      var ors = []
      $scope.search.orFields.forEach(function (field) {
        var sk = {}
        sk[field] = {like: $scope.search.text}
        ors.push(sk)
      })
      filter.where = {'or': ors}
    }
    
    if ($scope.includes.length > 0) {
      filter.include = $scope.includes
    }
    console.log('Filter:', filter, $scope)
    $scope.resource.query({filter: filter}, function (results) {
      $scope.enitities = results
    }, function (error) {
      console.log('Query ', $scope.resource, error)
    })
  }
  
  $scope.showDetail = function (entity) {
    console.log(entity)
  }
  
  $scope.dateFormat = function (date) {
    return moment.unix(date).format('YYYY-MM-DD hh:mm:ss')
  }
  
  $scope.init = function() {
    $scope.fetch()
  }
})
/**
 * Master Controller
 */
app.controller('MasterCtrl', function MasterCtrl($scope, $cookieStore) {
    /**
     * Sidebar Toggle & Cookie Control
     *
     */
    var mobileView = 992;

    $scope.getWidth = function() { return window.innerWidth; };

    $scope.$watch($scope.getWidth, function(newValue, oldValue)
    {
        if(newValue >= mobileView)
        {
            if(angular.isDefined($cookieStore.get('toggle')))
            {
                if($cookieStore.get('toggle') == false)
                {
                    $scope.toggle = false;
                }            
                else
                {
                    $scope.toggle = true;
                }
            }
            else 
            {
                $scope.toggle = true;
            }
        }
        else
        {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() 
    {
        $scope.toggle = ! $scope.toggle;

        $cookieStore.put('toggle', $scope.toggle);
    };
    
    $scope.loginform = {
      // trigger: 'click',
      closeEl: '.close-x',
      modal: {
        templateUrl: 'partials/loginform.html'
      }
    };

    window.onresize = function() { $scope.$apply(); };
});
/**
 * Alerts Controller
 */
angular.module('Dashboard').controller('AlertsCtrl', ['$scope', AlertsCtrl]);

function AlertsCtrl($scope) {
    $scope.alerts = [
        { type: 'success', msg: 'Thanks for visiting! Feel free to create pull requests to improve the dashboard!' },
        { type: 'danger', msg: 'Found a bug? Create an issue with as many details as you can.' }
    ];

    $scope.addAlert = function() {
        $scope.alerts.push({msg: 'Another alert!'});
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
}
/**
 * Members Controller
 */
app.controller('MembersCtrl', function MembersCtrl($scope, Member, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Member
  $scope.search.orFields = ['name', 'phone']
})
/**
 * Merchants Controller
 */
app.controller('MerchantsCtrl', function MerchantsCtrl($scope, Merchant, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Merchant
  $scope.search.orFields = ['name', 'phone']
})
/**
 * Shops Controller
 */
app.controller('ShopsCtrl', function ShopsCtrl($scope, Shop, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Shop
  $scope.search.orFields = ['name', 'phone']
  $scope.includes = ['merchant']
})
/**
 * Loading Directive
 * @see http://tobiasahlin.com/spinkit/
 */
angular.module('Dashboard').directive('rdLoading', rdLoading);

function rdLoading () {
    var directive = {
        restrict: 'AE',
        template: '<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
    };
    return directive;
};
app.directive('loginDialog', function (AUTH_EVENTS) {
  return {
    restrict: 'A',
    template: '<div ng-if="visible" ng-include="\'partials/login-form.html\'">',
    link: function (scope) {
      var showDialog = function () {
        scope.visible = true;
      };
  
      scope.visible = false;
      scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
      scope.$on(AUTH_EVENTS.sessionTimeout, showDialog)
    }
  };
})
.directive('formAutofillFix', function ($timeout) {
  return function (scope, element, attrs) {
    element.prop('method', 'post');
    if (attrs.ngSubmit) {
      $timeout(function () {
        element
          .unbind('submit')
          .bind('submit', function (event) {
            event.preventDefault();
            element
              .find('input, textarea, select')
              .trigger('input')
              .trigger('change')
              .trigger('keydown');
            scope.$apply(attrs.ngSubmit);
          });
      });
    }
  };
})
})();