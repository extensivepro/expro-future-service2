/**
 * Members Controller
 */
angular.module('Dashboard').controller('MembersCtrl', ['$scope', 'Members', MembersCtrl])

function MembersCtrl($scope, Members) {
  $scope.entities = []
  $scope.resource = Members
  $scope.sortOptions = []
  $scope.search = {
    text: '',
    orFields: ['name', 'phone']
  }

  var fetch = function () {
    var filter = { 
      order: ['createdAt DESC'],
      limit: 20
    }
    if($scope.search.text !== '' && $scope.search.orFields.length > 0) {
      var ors = []
      $scope.search.orFields.forEach(function (field) {
        var o = {}
        o[field] = {like: $scope.search.text}
        ors.push(o)
      })
      filter.where = {'or': ors}
    }
    console.log('Filter:', filter, $scope.search)
    $scope.resource.query({filter: filter}, function (results) {
      $scope.enitities = results
    }, function (error) {
      console.log('Query ', resource, error)
    })
  }
  
  $scope.fetch = fetch;
  $scope.dateFormat = function (date) {
    return moment.unix(date).format('YYYY-MM-DD hh:mm:ss')
  }
  
  $scope.init = function() {
    fetch()
  }
}