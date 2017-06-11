angular.module('mainController', ['authServices'])

.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope, $window) {
    var app = this;

    app.loadme = false;
    // FOR EACH PAGE -------------------------------------------
    $rootScope.$on('$routeChangeStart', function() {
        if (Auth.isLoggedIn()) {
            Auth.getUser().then(function(data) {
                app.username = data.data.username;
                app.useremail = data.data.email;
                if(data.data.tipo) {
                    app.tipo = data.data.tipo;
                    app.root = true;
                } else {
                    app.tipo = 'Regular';
                    app.root = false;
                }
                app.isLoggedIn = true;
                app.loadme = true;
            });
        } else {
            app.isLoggedIn = false;
            app.username = '';
            app.loadme = true;
        }
        if($location.hash() == '_=_') $location.hash(null);
    });
    // LOGIN FACEBOOK ------------------------------------------
    this.facebook = function() {
        //console.log($window.location.host); //localhost:8080
        //console.log($window.location.protocol); //http
        $window.location = $window.location.protocol + "//" + $window.location.host + '/auth/facebook';
    };
    // LOGIN ---------------------------------------------------
    this.doLogin = function(loginData) {
        app.loading = true;
        app.errorMsg = false;
        app.successMsg = false;
        //console.log('testing login controller');
        Auth.login(app.loginData).then(function(data) {
            /*console.log(data.data.success);
            console.log(data.data.message);*/
            if(data.data.success) {
                app.loading = false;
                // Create Success Message
                app.successMsg = data.data.message + '...Redirecting';
                // Redirect to Home Page
                $timeout(function() {
                    $location.path('/profile');
                    app.loginData = '';
                    app.successMsg = data.data.message;
                }, 2000);
            } else {
                app.loading = false;
                // Create Error Message
                app.errorMsg = data.data.message;
            }

        });
    };
    // LOGOUT --------------------------------------------------
    this.logout = function() {
        Auth.logout();
        $location.path('/logout');
        $timeout(function() {
            $location.path('/');
        }, 2000);
    };

});