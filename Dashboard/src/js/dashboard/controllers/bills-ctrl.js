/**
 * Bills Controller
 */
app.controller('BillsCtrl', function BillsCtrl($scope, Bill, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Bill
  $scope.search.orFields = ['amount', 'merchant.name', 'agent.name']
  $scope.includes = ['merchant', 'shop', 'agent']
})