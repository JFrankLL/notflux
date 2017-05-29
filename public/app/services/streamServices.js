angular.module('streamServices', [])

.factory('Stream', function($http) {
    streamFactory = {};

    // Stream.stream(fileName);
    streamFactory.stream = function(fileName){
        console.log('From service: ' + fileName);
        return $http.get('/api/stream');
    };

    return streamFactory;
});