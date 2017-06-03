
angular.module('videoController', ['videoServices'])

.controller('addCtrl', function($http, $location, $timeout, Video) {

    var app = this;

    //UPLOAD
    app.addVideo = function(videoData) {
        app.loading = true;
        app.errorMsg = false;
        
        Video.uploadVideo(app.videoData).then(function(data) {
            if(data.data.success) {
                app.loading = false;
                //Create Success Message
                app.successMsg = data.data.message;
                //Redirect to playlist
                $timeout(function(){
                    $location.path('/collection');
                }, 2000);
            } else {
                app.loading = false;
                //Create error Message
                app.errorMsg = data.data.message;                
            }
        }); 
    }
});

