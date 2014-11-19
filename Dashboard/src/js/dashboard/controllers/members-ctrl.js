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