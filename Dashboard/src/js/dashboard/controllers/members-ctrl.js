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

var CreateMemberModalInstanceCtrl = function ($scope, $modalInstance, $rootScope, Member) {

  $scope.entity = {
    merchant: {
      merchantID: "e20dccdf039b3874",
      fullName: "泛盈信息科技有限公司",
      "name": "泛盈科技"
    }
  }
  
  $scope.alerts = []
	
  $scope.tryCreate = function () {
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
}