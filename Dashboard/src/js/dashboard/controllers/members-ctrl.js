/**
 * Members Controller
 */
app.controller('MembersCtrl', function MembersCtrl($scope, Members, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Members
  $scope.search.orFields = ['name', 'phone']
})