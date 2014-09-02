/**
 * List Controller
 */
app.controller('ListCtrl', function ListCtrl($scope) {
  $scope.entities = []
  $scope.resource = undefined
  $scope.orderOptions = ['createdAt DESC']
  $scope.search = {
    text: '',
    orFields: ['name', 'phone']
  }

  $scope.fetch = function () {
    var filter = { 
      order: $scope.orderOptions,
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
    console.log('Filter:', filter, $scope)
    $scope.resource.query({filter: filter}, function (results) {
      $scope.enitities = results
    }, function (error) {
      console.log('Query ', resource, error)
    })
  }
  
  $scope.dateFormat = function (date) {
    return moment.unix(date).format('YYYY-MM-DD hh:mm:ss')
  }
  
  $scope.init = function() {
    $scope.fetch()
  }
})