(function(){ 
var app = angular.module('Dashboard', ['ui.utils', 'ui.bootstrap', 'ui.router', 'ngCookies', 'ngResource', 'ngMorph']).
config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.withCredentials = true
}])
'use strict';

/**
 * Route configuration for the Dashboard module.
 */
angular.module('Dashboard').config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider) {

    // For unmatched routes
    $urlRouterProvider.otherwise('/');

    // Application routes
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'partials/dashboard.html'
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
}]);

'use strict';

/* Services */

var baseURL = 'http://service.fankahui.com:3000/api'

angular.module('Dashboard')
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
    return $resource(baseURL + '/shops/:shopID', {merchantID: '@_id'}, {
      update: { method: 'PUT' } 
    })
  })
  
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
      console.log('Query ', resource, error)
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
app.controller('MembersCtrl', function MembersCtrl($scope, Members, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Members
  $scope.search.orFields = ['name', 'phone']
})
/**
 * Merchants Controller
 */
app.controller('MerchantsCtrl', function MerchantsCtrl($scope, Merchants, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Merchants
  $scope.search.orFields = ['name', 'phone']
})
/**
 * Shops Controller
 */
app.controller('ShopsCtrl', function ShopsCtrl($scope, Shops, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Shops
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
})();