angular.module('videoServices', [])

.factory('Video', function($http) {
    var videoFactory = {};
    
        //Video.uploadVideo(videoData) = CREATE
        videoFactory.uploadVideo = function(videoData) {
            return $http.post('/api/videos', videoData);
        }

        //Video.getVideos() = READ
        videoFactory.getVideos = function() {
            return $http.get('/api/videos/');       
        };

        //Video.editVideo() = UPDATE
        videoFactory.editVideo = function(_id, editData) {
            return $http.put('/api/videos/' + _id, editData);
        };

        //Video.deleteVideo() = DELETE
        videoFactory.deleteVideo = function(_id) {
            return $http.delete('/api/videos/' + _id);
        };

    return videoFactory;

});


