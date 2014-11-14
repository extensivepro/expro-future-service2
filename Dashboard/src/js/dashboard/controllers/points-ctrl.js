/**
 * Points Controller
 */
app.controller('PointsCtrl', function PointsCtrl($scope, Point, $controller) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Point
  $scope.search.orFields = ['member.name', 'phone']
  $scope.includes = ['agent']
})