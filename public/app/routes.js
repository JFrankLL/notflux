var app = angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
    // INICIO
    $routeProvider.when('/', {
        templateUrl: 'app/views/pages/home.html'
    })
    // ACERCA DE
    .when('/about', {
        templateUrl: 'app/views/pages/about.html'
    })
    // REGISTRARSE SIGN UP
    .when('/register', {
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'regCtrl',
        controllerAs: 'register',
        authenticated: false
    })
    // ENTRAR SIGN IN
    .when('/login', {
        templateUrl: 'app/views/pages/users/login.html',
        authenticated: false
    })
    // SALIR
    .when('/logout', {
        templateUrl: 'app/views/pages/users/logout.html',
        authenticated: true
    })
    // PROFILE
    .when('/profile', {
        templateUrl: 'app/views/pages/users/profile.html',
        authenticated: true
    })
    // FACEBOOK
    .when('/facebook/:token', {
        templateUrl: 'app/views/pages/users/social/social.html',
        controller: 'facebookCtrl',
        controllerAs: 'facebook',
        authenticated: false
    })
    // FACEBOOK ERROR
    .when('/facebookerror', {
        templateUrl: 'app/views/pages/users/login.html',
        controller: 'facebookCtrl',
        controllerAs: 'facebook'
    })
    // STREAM
    .when('/search', {
        templateUrl: 'app/views/pages/stream/search.html',
        controller: 'streamCtrl',
        controllerAs: 'stream',
        authenticated: true
    })
    .when('/play/:id', {
        templateUrl: 'app/views/pages/stream/play.html',
        controller: 'streamCtrl',
        controllerAs: 'stream',
        authenticated: true
    })
    // CUALQUIERA REDIRECCIONA A HOME
    .otherwise({ redirectTo: '/'} );
    // EVITA CHAR '#'
    $locationProvider.html5Mode({
       enabled: true,
       requireBase: false
    });
});

app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location) {

    $rootScope.$on('$routeChangeStart', function(event, next, current) {

        if (next.$$route.authenticated == true) { // Necesita autenticacion
            //console.log('needs to be authenticated')
            if (!Auth.isLoggedIn()) { // No se ha loggeado
                event.preventDefault();
                $location.path('/'); // Mandar a home
            }
        } else if (next.$$route.authenticated == false) { // Necesita estar sin autenticar
            //console.log('should not need to be authenticated')
            if (Auth.isLoggedIn()) { // No se ha loggeado
                event.preventDefault();
                $location.path('/profile');
            }
        } 
        //else console.log('authentication does not matter');

    });

}]);