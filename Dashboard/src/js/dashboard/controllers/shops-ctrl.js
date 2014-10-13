/**
 * Shops Controller
 */
app.controller('ShopsCtrl', function ShopsCtrl($scope, Shop, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Shop
  $scope.search.orFields = ['name', 'phone']
  $scope.includes = ['merchant']
})