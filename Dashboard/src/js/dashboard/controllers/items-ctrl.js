/**
 * Items Controller
 */
app.controller('ItemsCtrl', function ItemsCtrl($scope, Item, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Item
  $scope.search.orFields = ['name', 'phone']
  $scope.includes = ['merchant']
})