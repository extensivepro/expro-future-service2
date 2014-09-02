/**
 * Merchants Controller
 */
app.controller('MerchantsCtrl', function MerchantsCtrl($scope, Merchants, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Merchants
  $scope.search.orFields = ['name', 'phone']
})