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

var CreateEmployeModalInstanceCtrl = function ($scope, Employe, $controller, $modalInstance, CurrentEmploye) {
  $controller('CreateModalInstanceCtrl', {$scope: $scope, $modalInstance: $modalInstance})
  $scope.resource = Employe
  $scope.currentEmploye = CurrentEmploye

  $scope.entity = {
    merchantID: CurrentEmploye.merchantID,
    shopID: CurrentEmploye.shopID
  }
}