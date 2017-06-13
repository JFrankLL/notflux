angular.module('profileServices', [])

.factory('Profile', function($http) {
    profileFactory = {};

    // Profile.buscar(name);
    profileFactory.buscar       = function(name)    { return $http.get('/api/getList2?search=' + name); };
    // Profile.block(id);
    profileFactory.block        = function(id)      { return $http.get('/api/block?id=' + id); };
    // Profile.nVideo(nVid);
    profileFactory.nVideo       = function(nVid)    { return $http.post('/api/nuevoVideo', nVid); };
    // Profile.nSerie(nSer);
    profileFactory.nSerie       = function(nSer)    { return $http.post('/api/nuevaSerie', nSer); };
    // Profile.nSerie(nSer);
    profileFactory.getSeries    = function()        { return $http.get('/api/getSeries'); };
    
    return profileFactory;
});