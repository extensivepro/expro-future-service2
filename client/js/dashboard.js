(function(){ 
'use strict';

/* Services */

angular.module('expro-future2.services', ['lbServices'])  
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
});

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
    User.logout(function () {
      $rootScope.$broadcast('AUTH_LOGOUT')
    })
  }

  User.getCurrent(function (user) {
    $rootScope.currentUser = user
  }, function () {
    $rootScope.$broadcast('AUTH_LOGOUT')
  })
  
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
app.controller('MembersCtrl', function MembersCtrl($scope, Member, $controller, $modal) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Member
  $scope.search.orFields = ['name', 'phone']
  
  $scope.create = function () {
    var modalInstance = $modal.open({
      templateUrl: 'partials/member-add.html',
      controller: CreateMemberModalInstanceCtrl,
      size: 'lg'
    });

    modalInstance.result.then(function (member) {
      $scope.fetch()
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });
  }
  
})

var CreateMemberModalInstanceCtrl = function ($scope, $modalInstance, $rootScope, Member, Employe) {

  $scope.entity = {
    merchantID: "e20dccdf039b3874"
  }
  
  $scope.alerts = []
	
  $scope.tryCreate = function () {
    $scope.alerts = []
    Member.create($scope.entity, function (member) {
      $modalInstance.close(member);
    }, function (res) {
      $scope.alerts.push({type: 'danger', msg: '创建会员失败'})
    })
  }
  
  $scope.cancel = function () {
    $modalInstance.dismiss()
  }
  
  $scope.blurCb = function (evt) {
    $scope.entity.code = $scope.entity.phone
  }
  
  Employe.findOne({
    filter: {
      where: {id: $scope.currentUser.employeID},
      include: 'merchant'
    }
  }, function (employe) {
    $scope.merchant = employe.merchant
    $scope.entity.merchantID = employe.merchant.id
  }, function (res) {
    $scope.alerts.push({type: 'warning', msg: '没有找到雇员对应的商户'})
  })
}
/**
 * Merchants Controller
 */
app.controller('MerchantsCtrl', function MerchantsCtrl($scope, Merchant, $controller, $modal) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Merchant
  $scope.search.orFields = ['name', 'phone']
  // $scope.includes = ['merchantOwner']

  $scope.create = function () {
    var modalInstance = $modal.open({
      templateUrl: 'partials/merchant-add.html',
      controller: CreateMerchantModalInstanceCtrl,
      size: 'md'
    });

    modalInstance.result.then(function (member) {
      $scope.fetch()
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });
  }
  
})

var CreateMerchantModalInstanceCtrl = function ($scope, $modalInstance, $rootScope, Merchant) {

  var now = Date.now()
  $scope.entity = {
    ownerID: $scope.currentUser.id,
    masterPhone: $scope.currentUser.username,
    telephone: $scope.currentUser.username,
    fullName: "泛盈信息科技有限公司"+now,
    "name": "泛盈科技"+now
  }
  
  console.log($scope.currentUser)
  
  $scope.alerts = []
	
  $scope.tryCreate = function () {
    $scope.alerts = []
    Merchant.create($scope.entity, function (member) {
      $modalInstance.close(member);
    }, function (res) {
      $scope.alerts.push({type: 'danger', msg: '创建商户失败'})
    })
  }
  
  $scope.cancel = function () {
    $modalInstance.dismiss()
  }
  
  $scope.blurCb = function (evt) {
  }
}
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
 * Employes Controller
 */
app.controller('EmployesCtrl', function EmployesCtrl($scope, Employe, $controller, $modal) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Employe
  $scope.search.orFields = ['name', 'phone']
  $scope.includes = [{shop:'merchant'}]
  
  $scope.create = function () {
    var modalInstance = $modal.open({
      templateUrl: 'partials/member-add.html',
      controller: CreateEmployeModalInstanceCtrl,
      size: 'lg'
    });

    modalInstance.result.then(function (member) {
      $scope.fetch()
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });
  }
  
})

var CreateEmployeModalInstanceCtrl = function ($scope, $modalInstance, $rootScope, Employe) {

  $scope.entity = {
    merchant: {
      merchantID: "e20dccdf039b3874",
      fullName: "泛盈信息科技有限公司",
      "name": "泛盈科技"
    }
  }
  
  $scope.alerts = []
	
  $scope.tryCreate = function () {
    Employe.create($scope.entity, function (member) {
      $modalInstance.close(member);
    }, function (res) {
      $scope.alerts.push({type: 'danger', msg: '创建会员失败'})
    })
  }
  
  $scope.cancel = function () {
    $modalInstance.dismiss()
  }
  
  $scope.blurCb = function (evt) {
    $scope.entity.code = $scope.entity.phone
  }
}
/**
 * Points Controller
 */
app.controller('PointsCtrl', function PointsCtrl($scope, Point, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Point
  $scope.search.orFields = ['member.name', 'phone']
  $scope.includes = ['agent']
})
/**
 * Items Controller
 */
app.controller('ItemsCtrl', function ItemsCtrl($scope, Item, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Item
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