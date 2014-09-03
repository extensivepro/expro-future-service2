/**
 * Shops Controller
 */
app.controller('ShopsCtrl', function ShopsCtrl($scope, Shops, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Shops
  $scope.search.orFields = ['name', 'phone']
})