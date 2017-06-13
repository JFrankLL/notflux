angular.module('streamControllers', ['streamServices'])

.controller('streamCtrl', function(Stream, $location) {
    var app = this;

    // GET STREAMING VIDEO BY ROUTE-NAME
    this.stream = function(vidData) {
        //console.log("ctrl app val: " + vidData.vidName);
        //
        Stream.stream(vidData.vidName).then(function(video) {
            console.log("parte del video: " + video);
        });//*/

    };
    // SEARCH A LIST OF AVAILABLE VIDEOS
    this.searchFor = function(searchData) {
        //console.log('Ctrl buscar: ' + searchData.vidName);
        Stream.find(searchData.vidName).then(function(data) {
            //TODO: solve getimage when app.cover is not assigned yet. So server does not response a bad request answer.
            if(data.data) {
                //data.data[0].videos.forEach(function(element) { console.log(element); });
                app.isMultimedia = true;
                app.Multimedia = [];
                data.data.forEach(function(multimedia){
                    if(multimedia.season === false) { // PELICULA
                        multimedia.videos.forEach(function(vid){
                            app.Multimedia.push({
                                title: vid.name,
                                cover: vid.cover,
                                busquedas: vid.busquedas,
                                videos: [{ _id: vid._id, name: vid.name }]
                            });
                        });
                    } else { // SERIE
                        app.Multimedia.push(multimedia);
                    }
                });
            } else {
                console.log('StreamCtrl: No hay Multimedia');
                app.isMultimedia = false;
            }
        });
    };
    // SEARCH FOR CERTAIN MULTIMEDIA
    this.searchMultimedia = function() {
        
        var mulName = $location.search().search;

        Stream.find(mulName).then(function(data) {
             if(data.data) {
                app.isMultimedia = true;
                app.Multimedia = [];
                data.data.forEach(function(multimedia){
                    if(multimedia.season === false) { // PELICULA
                        multimedia.videos.forEach(function(vid){
                            app.Multimedia.push({
                                title: vid.name,
                                cover: vid.cover,
                                busquedas: vid.busquedas,
                                videos: [{ _id: vid._id, name: vid.name }]
                            });
                        });
                    } else { // SERIE
                        app.Multimedia.push(multimedia);
                    }
                });
                console.log( app.Multimedia)
            } else {
                console.log('StreamCtrl: No hay Multimedia');
                app.isMultimedia = false;
            }
        });
    };
    // GET COMMENTS
    this.getComments = function(videoId){
        Stream.getComments(videoId).then(function(data) {
            console.log(data);
            app.comentarios = data.data;
        });
    };
    // COMMENT
    this.comentar = function(comentario) {

        Stream.comentar(comentario).then(function(data) {
            app.getComments(comentario.video);
        });
    };
    // GET URL
    this.getParam = function(){
        var href = location.href;
        var id = href.match(/([^\/]*)\/*$/)[1];
        //console.log(id);  http://192.168.0.102:8080
        return id;
    };


});