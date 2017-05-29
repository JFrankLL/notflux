angular.module('streamServices', [])

.factory('Stream', function($http) {
    streamFactory = {};

    // Stream.stream(vidName);
    streamFactory.stream = function(vidName){
        console.log('From stream service: ' + vidName);
        return $http.get('/api/stream?vidName=' + vidName);
    };
    
    // Stream.find(vidName);
    streamFactory.find = function(vidName){
        return $http.get('/api/stream?search=' + vidName);
    };

    return streamFactory;
});