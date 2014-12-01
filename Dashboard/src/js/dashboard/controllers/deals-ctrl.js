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

var CreateDealModalInstanceCtrl = function ($scope, $modalInstance, $controller, Deal, $modal) {
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
    fee: 0,
    items:[]
  }
  
  $scope.showItems = function () {
    var modalInstance = $modal.open({
      templateUrl: 'deal-add-item-list.html',
      controller: ShowItemsModalInstanceCtrl
    })

    modalInstance.result.then(function (selectedItems) {
      selectedItems.forEach(function (item) {
        var exited = $scope.entity.items.some(function (dealItem) {
          if(item.id === dealItem.item.id) {
            dealItem.quantity += 1
            $scope.entity.quantity += 1
            $scope.entity.fee += dealItem.dealPrice 
            return true
          } else {
            return false
          }
        })
        if(exited) return
        $scope.entity.items.push({
          item: {
            id: item.id,
            "name": item.name,
            price: item.price
          },
          dealPrice: item.price,
          quantity: 1
        })        
        $scope.entity.quantity += 1
        $scope.entity.fee += item.price 
      })
    }, function () {
      console.info('Modal dismissed at: ' + new Date())
    })
  }
}

var ShowItemsModalInstanceCtrl = function ($scope, $modalInstance, Item) {
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
      merchantID: $scope.currentEmploye.merchantID
    },
    limit: 20
  }}, function (items) {
    $scope.entities = items
  }, function (res) {
    console.log('Can not found item', res)
  })
}

var DealDetailModalInstanceCtrl = function ($scope, $modalInstance, entity, Point, Bill) {
  
  $scope.entity = entity
  
  $scope.cancel = function () {
    $modalInstance.dismiss()
  }
}