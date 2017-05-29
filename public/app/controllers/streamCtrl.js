angular.module('userControllers', ['streamServices'])

.controller('streamCtrl', function(Stream) {
    var app = this;

    this.stream = function(vidData) {

        var reqStream = false;

        if(vidData.vidname == 'saul') {
            app.fileName = 'C:/Users/fv5_l/Videos/Series/Better Call Saul/Better.Call.Saul.S03E02.mp4';
            reqStream = true;
            console.log('video solicitado: ' + vidData.vidname);
        }

        if(reqStream) {
            Stream.stream(app.fileName).then(function(video) {
                console.log("parte del video: " + video);
            });
        } else {
            console.log('Stream clound not start');
        }
    };
});