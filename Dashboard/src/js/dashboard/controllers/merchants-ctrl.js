/**
 * Merchants Controller
 */
app.controller('MerchantsCtrl', function MerchantsCtrl($scope, Merchant, $controller, $modal) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Merchant
  $scope.search.orFields = ['name', 'phone']

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

  $scope.entity = {
    masterPhone: $rootScope.currentUser.username,
    telephone: $rootScope.currentUser.username,
    fullName: "泛盈信息科技有限公司",
    "name": "泛盈科技"
  }
  
  console.log($rootScope.currentUser)
  
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