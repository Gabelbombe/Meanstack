'use strict';

angular.module('benAppApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
