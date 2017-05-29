angular.module('authServices', [])

.factory('Auth', function($http, AuthToken) {
    authFactory = {};
    
    // LOGIN
    // Auth.login();
    authFactory.login = function(loginData){
        return $http.post('/api/authenticate', loginData).then(function(data) {
            //console.log(data.data.token);
            AuthToken.setToken(data.data.token);
            return data;
        });
    };
    // IS LOGGEDIN
    // Auth.isLoggedIn();
    authFactory.isLoggedIn = function() {
        if (AuthToken.getToken()) {
            return true;
        } else {
            return false;
        }
    };
    // FACEBOOK LOGIN
    // Auth.facebook();
    authFactory.facebook = function(token){
        AuthToken.setToken(token);
    };
    // GET USER
    // Auth.getUser();
    authFactory.getUser = function() {
        if (AuthToken.getToken()) {
            return $http.post('/api/me');
        } else {
            $q.reject({ message: 'user has no token' });// angular
        }
    };
    // LOGOUT
    // Auth.logout();
    authFactory.logout = function() {
        AuthToken.setToken();
    };

    return authFactory;
})

.factory('AuthToken', function($window) {
    var authTokenFactory = {};

    // AuthToken.setToken(token);
    authTokenFactory.setToken = function(token) {
        if(token) { // SET
            $window.localStorage.setItem('token', token);
        } else { // UNSET
            $window.localStorage.removeItem('token');
        }
    };

    // AuthToken.getToken();
    authTokenFactory.getToken = function() {
        return $window.localStorage.getItem('token');
    };

    return authTokenFactory;
})

.factory('AuthInterceptors', function(AuthToken) {
    var authInterceptorFactory = {};

    authInterceptorFactory.request = function(config) {
        var token = AuthToken.getToken();

        if (token) config.headers['x-access-token'] = token;

        return config;
    };

    return authInterceptorFactory;
});