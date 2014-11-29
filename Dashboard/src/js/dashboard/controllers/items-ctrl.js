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

var CreateItemModalInstanceCtrl = function ($scope, $modalInstance, $rootScope, Item) {

  $scope.entity = {
    merchantID: $scope.currentEmploye.merchant.id,
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
