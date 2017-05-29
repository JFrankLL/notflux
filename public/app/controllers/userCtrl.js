angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User) {
    var app = this;

    this.regUser = function(regData, valid) {
        app.loading = true;
        app.errorMsg = false;
        app.successMsg = false;

        if(valid) {
            //console.log('testing registration controller');
            User.create(app.regData).then(function(data) {
                /*console.log(data.data.success);
                console.log(data.data.message);*/
                if(data.data.success) {
                    app.loading = false;
                    // Create Success Message
                    app.successMsg = data.data.message + '...Redirecting';
                    // Redirect to Home Page
                    $timeout(function(){
                        $location.path('/');
                    }, 2000);
                } else {
                    // Create Error Message
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            });
        } else {
            // Create Error Message
            app.loading = false;
            app.errorMsg = 'Please ensure the form is filled up properly.';
        }
    };

})

.controller('facebookCtrl', function($routeParams, Auth, $location, $window) {
    var app = this;

    if ($window.location.pathname == '/facebookerror') {
        // error var
        app.errorMsg = 'Facebook e-mail not found in database networks';
    } else {
        //console.log($routeParams.token);
        Auth.facebook($routeParams.token);
        $location.path('/');
    }

});