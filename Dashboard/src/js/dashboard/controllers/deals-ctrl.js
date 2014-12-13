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
function ($scope, $modalInstance, $controller, Deal, $modal, DealTransaction, User) {
  $controller('CreateModalInstanceCtrl', {$scope: $scope, $modalInstance: $modalInstance})
  $scope.resource = Deal
  
  $scope.entity = DealTransaction.open()  
  
  $scope.showMembers = function () {
    var modalInstance = $modal.open({
      templateUrl: 'member-list.html',
      controller: 'ShowMembersModalInstanceCtrl'
    })

    modalInstance.result.then(DealTransaction.setMember, function () {
      console.info('Modal dismissed at: ' + new Date())
    })
  }
  
  $scope.showItems = function () {
    var modalInstance = $modal.open({
      templateUrl: 'deal-add-item-list.html',
      controller: 'ShowItemsModalInstanceCtrl'
    })

    modalInstance.result.then(DealTransaction.registerItems, function () {
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
  
  Member.find({filter:{
    where:{
      "merchant.merchantID": CurrentEmploye.currentEmploye().merchantID
    },
    limit: 20
  }}, function (entities) {
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
      merchantID: CurrentEmploye.currentEmploye().merchantID
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