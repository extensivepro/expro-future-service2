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

app.controller('CreateDealModalInstanceCtrl', function ($scope, $modalInstance, $controller, Deal, $modal) {
  $controller('CreateModalInstanceCtrl', {$scope: $scope, $modalInstance: $modalInstance})
  $scope.resource = Deal
  
  var now = Date.now()
  $scope.entity = {
    merchantID: $scope.currentEmploye.merchant.id,
    shopID: $scope.currentEmploye.shopID,
    seller: {
      employeID: $scope.currentEmploye.id,
      jobNumber: $scope.currentEmploye.jobNumber,
      "name": $scope.currentEmploye.name
    },
    serialNumber: now,
    quantity: 0,
    fee: 0,
    items: [],
    bill: {
      amount: 0,
      billNumber: now,
      shopID: $scope.currentEmploye.shopID,
      merchantID: $scope.currentEmploye.merchantID,
      agentID: $scope.currentUser.employeID,
      dealType: 'deal'
    }
  }
  
  $scope.cashSettlement = {
    "status": 'closed',
    serialNumber: now,
    amount: 0,
    settledAt: now,
    payType: 'cash'
  }
  
  $scope.memberSettlement = {
    "status": 'closed',
    serialNumber: now,
    amount: 0,
    settledAt: now,
    payType: 'perpay'
  }
  
  $scope.showMembers = function () {
    var modalInstance = $modal.open({
      templateUrl: 'member-list.html',
      controller: 'ShowMembersModalInstanceCtrl'
    })

    modalInstance.result.then(function (selectedMember) {
      $scope.memberSettlement.payerAccount = selectedMember.account
    }, function () {
      console.info('Modal dismissed at: ' + new Date())
    })
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

  var settle = function (settlement) {
    return settlement && settlement.amount > 0 ? settlement : null
  }
  $scope.tryCreate = function () {
    $scope.alerts = []
    $scope.entity.bill.amount = $scope.entity.fee
    $scope.entity.bill.cashSettlement = settle($scope.cashSettlement)
    $scope.entity.bill.memberSettlement = settle($scope.memberSettlement)
    $scope.resource.create($scope.entity, function (entity) {
      $modalInstance.close(entity)
    }, function (res) {
      $scope.alerts.push({type: 'danger', msg: '创建失败'})
    })
  }
})

app.controller('ShowMembersModalInstanceCtrl', function ($scope, $modalInstance, Member) {
  $scope.entities = []

  $scope.select = function (entity) {
    $modalInstance.close(entity)
  }
  
  Member.find({filter:{
    where:{
      "merchant.merchantID": $scope.currentEmploye.merchantID
    },
    limit: 20
  }}, function (entities) {
    $scope.entities = entities
  }, function (res) {
    console.log('Can not found item', res)
  })
})

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