/**
 * Members Controller
 */
app.controller('MembersCtrl', function MembersCtrl($scope, Member, $controller, $modal) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Member
  $scope.search.orFields = ['name', 'phone']
  
  $scope.create = function () {
    var modalInstance = $modal.open({
      templateUrl: 'partials/member-add.html',
      controller: CreateMemberModalInstanceCtrl,
      size: 'lg'
    });

    modalInstance.result.then(function (member) {
      $scope.fetch()
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });
  }
  
  $scope.showDetail = function (entity) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/member-detail.html',
      controller: MemberDetailModalInstanceCtrl,
      size: 'lg',
      resolve: {
        entity: function () {
          return entity
        }
      }
    });

    modalInstance.result.then(function (member) {
      $scope.fetch()
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });
  }
  
})

var CreateMemberModalInstanceCtrl = function ($scope, $modalInstance, $rootScope, Member, Employe) {

  $scope.entity = {
    merchantID: "e20dccdf039b3874"
  }
  
  $scope.alerts = []
	
  $scope.tryCreate = function () {
    $scope.alerts = []
    Member.create($scope.entity, function (member) {
      $modalInstance.close(member);
    }, function (res) {
      $scope.alerts.push({type: 'danger', msg: '创建会员失败'})
    })
  }
  
  $scope.cancel = function () {
    $modalInstance.dismiss()
  }
  
  $scope.blurCb = function (evt) {
    $scope.entity.code = $scope.entity.phone
  }
  
  Employe.findOne({
    filter: {
      where: {id: $scope.currentUser.employeID},
      include: 'merchant'
    }
  }, function (employe) {
    $scope.merchant = employe.merchant
    $scope.entity.merchantID = employe.merchant.id
  }, function (res) {
    $scope.alerts.push({type: 'warning', msg: '没有找到雇员对应的商户'})
  })
}

var MemberDetailModalInstanceCtrl = function ($scope, $modalInstance, $rootScope, entity, Point) {
  
  $scope.entity = entity
  
  $scope.status = {
    isopen: false
  }
  
  $scope.pointValue = 16
  
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
  
}