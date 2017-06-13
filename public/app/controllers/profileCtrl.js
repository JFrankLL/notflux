angular.module('profileController', ['profileServices', 'mainController'])

.controller('profileCtrl', function(Profile) {
    var app = this;
    app.bloqueos = app.masVideos = app.masSeries = app.borrados = app.modificaciones = false;
    app.lista = false;
    // Show and hide panels (Admin Options)
    this.menu = function(cual){
        app.bloqueos = app.masVideos = app.masSeries = app.borrados = app.modificaciones = false;
        switch(cual) {
        case 1: app.bloqueos    = true; break;
        case 2: app.masSeries   = true; break;
        case 3: app.masVideos   = true; break;
        case 4: app.borrados    = true; break;
        case 5: app.modificaciones = true; break;
        default: app.bloqueos = app.masVideos = app.masSeries = app.borrados = app.modificaciones = false;
        }
    };
    // Select menu
    this.loadSeries = function(){
        Profile.getSeries().then(function(lista) {
            //console.log(lista);
            app.series = lista.data;
        });
    };
    // Para block
    this.buscar = function(name) {
        Profile.buscar(name).then(function(data) {
            app.lista = data.data;
        });
    };
    // Block video
    this.bloquear = function(id) {
        Profile.block(id).then(function(data) {
            //console.log(data.data[0].videos)
            app.lista = data.data[0];
        });
    };
    // Add video
    this.nuevoVideo = function(nVid) {
        Profile.nVideo(nVid).then(function(data) {
            console.log(app.serie)
            //console.log(data.data[0].videos)
        });
    };
    // Add multimedia
    this.nuevaSerie = function(nSer) {
        Profile.nSerie(nSer).then(function(data) {
            console.log(data)
            //console.log(data.data[0].videos)
        });
    };
    // Change profile attributes
    this.cambio = function(cambio) {
        console.log(cambio);
        /*/
        Profile.cambio().then(function (data) {

        });//*/
    };

});