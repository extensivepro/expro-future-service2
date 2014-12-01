/**
 * List Controller
 */
app.controller('ListCtrl', function ListCtrl($scope, $modal) {
  $scope.entities = []
  $scope.resource = undefined
  $scope.orderOptions = ['createdAt DESC']
  $scope.search = {
    text: '',
    orFields: ['name', 'phone'],
  }
  $scope.includes = []
  $scope.createModalOption = undefined
  $scope.detailModalOption = undefined

  $scope.fetch = function () {
    var filter = { 
      order: $scope.orderOptions,
      limit: 20
    }
    if($scope.search.text !== '' && $scope.search.orFields.length > 0) {
      var ors = []
      $scope.search.orFields.forEach(function (field) {
        var sk = {}
        sk[field] = {like: $scope.search.text}
        ors.push(sk)
      })
      filter.where = {'or': ors}
    }
    
    if ($scope.includes.length > 0) {
      filter.include = $scope.includes
    }
    // console.log('Filter:', filter, $scope)
    $scope.resource.query({filter: filter}, function (results) {
      $scope.entities = results
    }, function (error) {
      console.log('Query ', $scope.resource, error)
    })
  }
  
  var modal = function (modalOption, entity) {
    if(!modalOption) return
    if(entity) {
      modalOption.resolve = {
        entity: function () {
          return entity
        }
      }
    }
    modalOption.size = modal.size || 'lg'
    var modalInstance = $modal.open(modalOption);

    modalInstance.result.then(function (entity) {
      $scope.fetch()
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });
  }
  
  $scope.showCreate = function () {
    modal($scope.createModalOption)
  }

  $scope.showDetail = function (entity) {
    modal($scope.detailModalOption, entity)
  }
  
  $scope.init = function() {
    $scope.fetch()
  }
})

app.controller('CreateModalInstanceCtrl', function ($scope, $modalInstance) {

  $scope.entity = {}
  $scope.resource = undefined
  	
  $scope.tryCreate = function () {
    $scope.alerts = []
    $scope.resource.create($scope.entity, function (entity) {
      $modalInstance.close(entity)
    }, function (res) {
      $scope.alerts.push({type: 'danger', msg: '创建失败'})
    })
  }
  
  $scope.cancel = function () {
    $modalInstance.dismiss()
  }
})