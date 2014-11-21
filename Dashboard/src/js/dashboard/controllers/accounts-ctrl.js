/**
 * Accounts Controller
 */
app.controller('AccountsCtrl', function AccountsCtrl($scope, Account, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Account
  $scope.search.orFields = ['name']
  // $scope.includes = ['merchant', 'shop', 'agent']
})