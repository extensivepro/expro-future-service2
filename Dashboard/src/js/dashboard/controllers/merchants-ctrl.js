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