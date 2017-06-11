angular.module('userApp', [ 'appRoutes', 'userControllers', 'userServices',
                            'ngAnimate', 'mainController', 'authServices',
                            'streamControllers', 'profileController'
                        ])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});