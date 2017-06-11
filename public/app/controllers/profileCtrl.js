angular.module('profileController', ['profileServices'])

.controller('profileCtrl', function(Profile) {
    var app = this;
    app.check = false;
    // 
    this.buscar = function(name) {
        Profile.buscar(name).then(function(data) {
            app.lista = data.data;
        });
    };
    //
    this.bloquear = function(id) {
        Profile.block(id).then(function(data) {
            //console.log(data.data[0].videos)
            app.lista = data.data[0];
        });
    };

});