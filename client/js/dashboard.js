(function(){ 
'use strict';

/* Services */

angular.module('expro-future2.services', ['ef-services2'])
var app = angular.module('Dashboard', ['ui.utils', 'ui.bootstrap', 'ui.router', 'ngCookies', 'ngMorph', 'mgo-angular-wizard', 'expro-future2.services'])
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
    .state('bills', {
      url: '/bills',
      templateUrl: 'partials/bills.html'
    })
    .state('deals', {
      url: '/deals',
      templateUrl: 'partials/deals.html'
    })
});

/**
 * Application Controller
 * Global Level variable and function
 */

app.controller('ApplicationCtrl', function ($scope, $rootScope, $modal, User, CurrentEmploye) {
    
  $rootScope.$on('AUTH_LOGIN', function(e, user) {
    CurrentEmploye.setEmploye(user.user)
    $scope.currentUser = user.user
  });

  $rootScope.$on('AUTH_LOGOUT', function (d, data) {
    CurrentEmploye.clearEmploye()
    $scope.currentUser = null
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

  User.getCurrent(function (user) {
    CurrentEmploye.setEmploye(user)
    $scope.currentUser = user
  }, function () {
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

var ResetPasswordModalInstanceCtrl = function ($scope, $modalInstance, User) {
  $scope.credentials = {}
  
  $scope.resetPassword = function (credentials) {
    $scope.alerts = []

    if (credentials.password !== credentials.password2) {
      return $scope.alerts.push({type: 'danger', msg: '两次输入的密码不一致'})      
    }
    
    User.upsert({
      id: User.getCurrentId(),
      password: credentials.password
    }, function (user) {
      $modalInstance.close()
    }, function (res) {
      $scope.alerts.push({type: 'danger', msg: '更新用户密码失败'})      
    })
  }
}
/**
 * List Controller
 */
app.controller('ListCtrl', function ListCtrl($scope, $modal) {
  $scope.entities = []
  $scope.resource = undefined
  $scope.orderOptions = ['createdAt DESC']
  $scope.search = {
    text: '',
    orFields: ['name', 'phone'],
  }
  $scope.includes = []
  $scope.createModalOption = undefined
  $scope.detailModalOption = undefined

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
    // console.log('Filter:', filter, $scope)
    $scope.resource.query({filter: filter}, function (results) {
      $scope.entities = results
    }, function (error) {
      console.log('Query ', $scope.resource, error)
    })
  }
  
  var modal = function (modalOption, entity) {
    if(!modalOption) return
    if(entity) {
      modalOption.resolve = {
        entity: function () {
          return entity
        }
      }
    }
    modalOption.size = modal.size || 'lg'
    var modalInstance = $modal.open(modalOption)

    modalInstance.result.then(function (entity) {
      $scope.fetch()
    }, function () {
      console.info('Modal dismissed at: ' + new Date())
    })
  }
  
  $scope.showCreate = function () {
    modal($scope.createModalOption)
  }

  $scope.showDetail = function (entity) {
    modal($scope.detailModalOption, entity)
  }
  
  $scope.init = function() {
    $scope.fetch()
  }
})

app.controller('CreateModalInstanceCtrl', function ($scope, $modalInstance) {

  $scope.entity = {}
  $scope.resource = undefined
  	
  $scope.tryCreate = function () {
    $scope.alerts = []
    $scope.resource.create($scope.entity, function (entity) {
      $modalInstance.close(entity)
    }, function (res) {
      $scope.alerts.push({type: 'danger', msg: '创建失败'})
    })
  }
  
  $scope.cancel = function () {
    $modalInstance.dismiss()
  }
})
/**
 * Master Controller
 */
app.controller('MasterCtrl', function MasterCtrl($scope, $rootScope, $cookieStore) {
  
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
  $scope.createModalOption = {
    templateUrl: 'partials/member-add.html',
    controller: CreateMemberModalInstanceCtrl,
  }
  $scope.detailModalOption = {
    templateUrl: 'partials/member-detail.html',
    controller: MemberDetailModalInstanceCtrl,
  }
  
})

var CreateMemberModalInstanceCtrl = function ($scope, $modalInstance, $controller, Member, CurrentEmploye) {
  $controller('CreateModalInstanceCtrl', {$scope: $scope, $modalInstance: $modalInstance})
  $scope.resource = Member
  $scope.currentEmploye = CurrentEmploye

  $scope.entity = {
    merchantID: CurrentEmploye.merchantID
  }
  
  $scope.blurCb = function (evt) {
    $scope.entity.code = $scope.entity.phone
  }  
}

var MemberDetailModalInstanceCtrl = function ($scope, $modalInstance, CurrentEmploye, entity, Point, Bill) {
  
  $scope.entity = entity
  
  $scope.alerts = []

  $scope.status = {
    isPointOpen: false,
    isPrepayOpen: false
  }
  
  $scope.pointValue = 16
  $scope.prepayValue = 10
  
  $scope.cancel = function () {
    $modalInstance.dismiss()
  }
  
  $scope.save = function () {
    $modalInstance.dismiss()
  }
  
  $scope.toggleDropdown = function($event) {
    $event.preventDefault()
    $event.stopPropagation()
    $scope.status.isopen = !$scope.status.isopen
  }
  
  var operatePoint = function (point, reason) {
    Point.create({
      point: point,
      memberID: entity.id,
      agentID: CurrentEmploye.id,
      reason: reason
    }, function (point) {
      entity.postPoint = point.postPoint
      entity.postTotalPoint = point.postTotalPoint
    }, function (res) {
      $scope.alerts.push({type: 'danger', msg: '积分操作失败'})
    })
  }
  
  $scope.accumulatePoint = function () {
    operatePoint($scope.pointValue, "手动累积")
  }
  
  $scope.exchangeGift = function () {
    operatePoint(0-$scope.pointValue, "手动兑换积分")
  }
  
  var operatePrepay = function (dealType ,accountType) {
    var amount = $scope.prepayValue*100
    var now = Math.floor(Date.now()/1000)
    var opt = {
      dealType: dealType,
      amount: amount,
      billNumber: now,
      shopID: CurrentEmploye.shopID,
      merchantID: CurrentEmploye.merchantID,
      agentID: CurrentEmploye.id,
      cashSettlement: {
        "status": 'closed',
        serialNumber: now,
        amount: amount,
        settledAt: now,
        payType: 'cash'
      },
      memberSettlement: {
        "status": 'closed',
        serialNumber: now,
        amount: amount,
        settledAt: now,
        payType: 'perpay'
      }
    }
    
    opt.memberSettlement[accountType] = {
      id: entity.account.id,
      "name": entity.account.name,
      balance: entity.account.balance
    }
    Bill.create(opt, function (bill) {
      if(accountType === "payeeAccount") {
        entity.account.balance += amount 
      } else {
        entity.account.balance -= amount 
      }
    }, function (res) {
      $scope.alerts.push({type: 'danger', msg: '储值操作失败'})
    })
  }
  $scope.prepay = function () {
    operatePrepay('prepay', "payeeAccount")
  }
  
  $scope.withdraw = function () {
    operatePrepay("withdraw", "payerAccount")
  }
  
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

var CreateMerchantModalInstanceCtrl = function ($scope, $modalInstance, CurrentEmploye, User, Merchant) {

  var now = Date.now()
  $scope.entity = {
    ownerID: User.getCurrentId(),
    masterPhone: User.getCachedCurrent().username,
    telephone: User.getCachedCurrent().username,
    fullName: "泛盈信息科技有限公司"+now,
    "name": "泛盈科技"+now
  }
    
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
  $scope.createModalOption = {
    templateUrl: 'partials/employe-add.html',
    controller: CreateEmployeModalInstanceCtrl,
  }
  
})

var CreateEmployeModalInstanceCtrl = function ($scope, Employe, $controller, $modalInstance, CurrentEmploye) {
  $controller('CreateModalInstanceCtrl', {$scope: $scope, $modalInstance: $modalInstance})
  $scope.resource = Employe
  $scope.currentEmploye = CurrentEmploye

  $scope.entity = {
    merchantID: CurrentEmploye.merchantID,
    shopID: CurrentEmploye.shopID
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
app.controller('ItemsCtrl', function ItemsCtrl($scope, Item, $controller, $modal) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Item
  $scope.search.orFields = ['name', 'phone']
  $scope.includes = ['merchant']
  
  $scope.showCreate = function () {
    
    var modalInstance = $modal.open({
      templateUrl: 'partials/item-add.html',
      controller: CreateItemModalInstanceCtrl,
      size: 'lg'
    });

    modalInstance.result.then(function (member) {
      $scope.fetch()
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });
    
  }
})

var CreateItemModalInstanceCtrl = function ($scope, $modalInstance, CurrentEmploye, Item) {

  $scope.currentEmploye = CurrentEmploye

  $scope.entity = {
    merchantID: CurrentEmploye.merchantID,
    name: "化妆品"+Date.now(),
    code: "1234567890",
    price: 900
  }
  
  $scope.tryCreate = function () {
    $scope.alerts = []
    Item.create($scope.entity, function (member) {
      $modalInstance.close(member);
    }, function (res) {
      $scope.alerts.push({type: 'danger', msg: '创建商品失败'})
    })
  }
  
  $scope.cancel = function () {
    $modalInstance.dismiss()
  }  
}

/**
 * Bills Controller
 */
app.controller('BillsCtrl', function BillsCtrl($scope, Bill, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Bill
  $scope.search.orFields = ['amount', 'merchant.name', 'agent.name']
  $scope.includes = ['merchant', 'shop', 'agent']
})
/**
 * Accounts Controller
 */
app.controller('AccountsCtrl', function AccountsCtrl($scope, Account, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Account
  $scope.search.orFields = ['name']
  // $scope.includes = ['merchant', 'shop', 'agent']
})
/**
 * Deals Controller
 */
app.controller('DealsCtrl', function DealsCtrl($scope, Deal, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Deal
  $scope.search.orFields = ['merchant.name']
  $scope.includes = ['merchant', 'shop', 'bill']
  $scope.createModalOption = {
    templateUrl: 'partials/deal-add.html',
    controller: 'CreateDealModalInstanceCtrl'
  }
  $scope.detailModalOption = {
    templateUrl: 'partials/deal-detail.html',
    controller: DealDetailModalInstanceCtrl
  }
  
})

app.controller('CreateDealModalInstanceCtrl', 
function ($scope, $modalInstance, $controller, Deal, $modal, DealTransaction, User, CurrentEmploye) {
  $controller('CreateModalInstanceCtrl', {$scope: $scope, $modalInstance: $modalInstance})
  $scope.resource = Deal
  $scope.currentEmploye = CurrentEmploye
  
  $scope.entity = DealTransaction  
  
  $scope.showMembers = function () {
    var modalInstance = $modal.open({
      templateUrl: 'member-list.html',
      controller: 'ShowMembersModalInstanceCtrl'
    })

    modalInstance.result.then(function (member) {
      DealTransaction.setMember(member)
    }, function () {
      console.info('Modal dismissed at: ' + new Date())
    })
  }
  
  $scope.showItems = function () {
    var modalInstance = $modal.open({
      templateUrl: 'deal-add-item-list.html',
      controller: 'ShowItemsModalInstanceCtrl'
    })

    modalInstance.result.then(function (items) {
      DealTransaction.registerItems(items)
    }, function () {
      console.info('Modal dismissed at: ' + new Date())
    })
  }

  $scope.tryCreate = function () {
    $scope.alerts = []
    DealTransaction.settle(function (entity) {
      $modalInstance.close(entity)
    }, function (res, alertMsg) {
      $scope.alerts.push(alertMsg)
    })
  }
})

app.controller('ShowMembersModalInstanceCtrl', function ($scope, $modalInstance, Member, CurrentEmploye) {
  $scope.entities = []

  $scope.select = function (entity) {
    $modalInstance.close(entity)
  }
  
  Member.find(function (entities) {
    $scope.entities = entities
  }, function (res) {
    console.log('Can not found item', res)
  })
})

app.controller('ShowItemsModalInstanceCtrl', function ($scope, $modalInstance, Item, CurrentEmploye) {
  $scope.entities = []
  
  $scope.confirm = function () {
    $modalInstance.close($scope.entities.filter(function (entity) {
      return entity.isChecked
    }))
  }
  
  $scope.cancel = function () {
    $modalInstance.dismiss()
  }
  
  Item.find({filter:{
    where:{
      merchantID: CurrentEmploye.merchantID
    },
    limit: 20
  }}, function (items) {
    $scope.entities = items
  }, function (res) {
    console.log('Can not found item', res)
  })
})

var DealDetailModalInstanceCtrl = function ($scope, $modalInstance, entity) {
  
  $scope.entity = entity
  
  $scope.cancel = function () {
    $modalInstance.dismiss()
  }
}
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
app
.filter("dateFormat", function () {
  return function (date, format) {
    format = format || 'YYYY-MM-DD HH:mm:ss'
    return moment.unix(date).format(format)
  }
})

.filter("billOwner", function () {
  return function (settlement) {
    var owner = '走入客户'
    if(settlement && settlement.payeeAccount) {
      owner = settlement.payeeAccount.name
    } else if(settlement && settlement.payerAccount) {
      owner = settlement.payerAccount.name
    }
    return owner
  }
})

})();