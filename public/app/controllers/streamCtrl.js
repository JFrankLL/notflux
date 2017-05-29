angular.module('streamControllers', ['streamServices'])

.controller('streamCtrl', function(Stream) {
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
    // TODO: mongo query verify video actually exists
    this.searchFor = function(searchData) {
        Stream.find(searchData.vidName).then(function(videosList) {
            console.log(videosList);
        });
    };
});