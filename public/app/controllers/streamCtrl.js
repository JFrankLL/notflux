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
        Stream.find(searchData.vidName).then(function(videosList) {
            if(videosList.data.length > 0) {
                videosList.data.forEach(function(element) {
                    console.log(element);
                });
                app.isLista = true;
                app.lista = videosList.data;
            } else {
                console.log('StreamCtrl: No hay lista');
                app.isLista = false;
            }
        });
    };

    // GET URL
    this.getParam = function(){
        var href = location.href;
        var id = href.match(/([^\/]*)\/*$/)[1];
        console.log(id);
        return 'http://192.168.0.11:8080/api/stream?search=' + id;
    };

});