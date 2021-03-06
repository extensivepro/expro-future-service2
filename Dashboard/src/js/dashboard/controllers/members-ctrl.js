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