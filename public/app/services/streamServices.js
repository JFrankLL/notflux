angular.module('streamServices', [])

.factory('Stream', function($http) {
    streamFactory = {};

    // Stream.stream(vidName);
    streamFactory.stream = function(vidName){ return $http.get('/api/stream?vidName=' + vidName); };
    
    // Stream.find(vidName);
    streamFactory.find = function(vidName){ return $http.get('/api/getList?search=' + vidName); };

    // Stream.comentar(comentario)
    streamFactory.comentar = function(comentario){ return $http.post('/api/comentar', comentario); };

    // Stream.comentar(comentario)
    streamFactory.getComments = function(videoId){ return $http.get('/api/getComentarios?videoId=' + videoId); };


    return streamFactory;
});