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
    controller: CreateDealModalInstanceCtrl
  }
  $scope.detailModalOption = {
    templateUrl: 'partials/deal-detail.html',
    controller: DealDetailModalInstanceCtrl
  }
  
})

var CreateDealModalInstanceCtrl = function ($scope, $modalInstance, $controller, Deal) {
  $controller('CreateModalInstanceCtrl', {$scope: $scope, $modalInstance: $modalInstance})
  $scope.resource = Deal

  $scope.entity = {
    merchantID: $scope.currentEmploye.merchant.id,
    shopID: $scope.currentEmploye.shopID,
    seller: {
      employeID: $scope.currentEmploye.id,
      jobNumber: $scope.currentEmploye.jobNumber,
      "name": $scope.currentEmploye.name
    },
    serialNumber: Date.now(),
    quantity: 0,
    fee: 0
  }
}

var DealDetailModalInstanceCtrl = function ($scope, $modalInstance, entity, Point, Bill) {
  
  $scope.entity = entity
  
  $scope.cancel = function () {
    $modalInstance.dismiss()
  }
}