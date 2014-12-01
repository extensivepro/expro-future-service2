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
    shopID: $scope.currentEmploye.shopID
  }
}

var DealDetailModalInstanceCtrl = function ($scope, $modalInstance, entity, Point, Bill) {
  
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
      agentID: $scope.currentUser.employeID,
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
      shopID: $scope.currentEmploye.shopID,
      merchantID: $scope.currentEmploye.merchantID,
      agentID: $scope.currentUser.employeID,
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