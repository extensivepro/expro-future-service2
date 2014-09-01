'use strict';

/* Services */

var baseURL = 'http://service.fankahui.com:3000/api'

angular.module('Dashboard')
  .factory("Members", function ($resource) {
    return $resource(baseURL + '/members/:memberID', {memberID: '@_id'}, {
      update: { method: 'PUT' } ,
      count: { method: 'GET' , params: {memberID: 'count'}}
    })
  })