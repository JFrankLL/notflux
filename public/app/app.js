angular.module('userApp', [ 'appRoutes', 'userControllers', 'userServices',
                            'ngAnimate', 'mainController', 'authServices',
                            'streamControllers'
                        ])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});