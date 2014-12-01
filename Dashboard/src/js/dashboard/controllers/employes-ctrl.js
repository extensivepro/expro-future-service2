/**
 * Employes Controller
 */
app.controller('EmployesCtrl', function EmployesCtrl($scope, Employe, $controller, $modal) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Employe
  $scope.search.orFields = ['name', 'phone']
  $scope.includes = [{shop:'merchant'}]
  $scope.createModalOption = {
    templateUrl: 'partials/employe-add.html',
    controller: CreateEmployeModalInstanceCtrl,
  }
  
})

var CreateEmployeModalInstanceCtrl = function ($scope, Employe, $controller, $modalInstance) {
  $controller('CreateModalInstanceCtrl', {$scope: $scope, $modalInstance: $modalInstance})
  $scope.resource = Employe

  $scope.entity = {
    merchantID: $scope.currentEmploye.merchant.id,
    shopID: $scope.currentEmploye.shopID
  }
}