/**
 * Deals Controller
 */
app.controller('DealsCtrl', function DealsCtrl($scope, Deal, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Deal
  $scope.search.orFields = ['merchant.name']
  $scope.includes = ['merchant', 'shop', 'bill']
})