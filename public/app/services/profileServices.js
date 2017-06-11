angular.module('profileServices', [])

.factory('Profile', function($http) {
    profileFactory = {};

    // Profile.buscar(name);
    profileFactory.buscar = function(name) {
        return $http.get('/api/getList2?search=' + name);
    };
    // Profile.block(id);
    profileFactory.block = function(id) {
        return $http.get('/api/block?id=' + id);
    };

    

    return profileFactory;
});