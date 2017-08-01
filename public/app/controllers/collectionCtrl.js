angular.module('collectionController', [])

.controller('collectionCtrl', function(Video, $timeout, $sce, Auth) {
    var app = this;
    app.loading = true;
    app.limit = 5;

    //GET VIDEOS FROM THE DB
    app.callCollection = function() { 
        Video.getVideos().then(function(data) {
        app.videos = data.data;
        app.loading = false;       
        return data;
        })
    }

    app.callCollection();

    //FILTER
    app.showMore = function(number) {
        app.showMoreError = false;
        if(number > 0) {
            app.limit = number;
        } else {
            app.showMoreError = 'Please enter a valid number.';
        }
    };

    app.showAll = function() {
        app.limit = undefined;
        app.showMoreError = false;
    }

    //PLAY VIDEO
    app.playVideo = function(link, title) {
        vid = {};
        this.linkEmbed = link.replace("watch?v=", "embed/");
        this.linkTrim = this.linkEmbed.substring(0, 41);
        app.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
            }
        app.vid = {src: this.linkTrim, title: title};
        return app.vid;
    }

    //EDIT VIDEO
   app.preditVideo = function(link, title, _id) {
        vid = {};
        app.vid = { link: link, title: title, _id: _id };
        return app.vid;
    }

    app.editVideo = function(_id, editData) {
        app.loading = true;
        app.errorMsg = false;
        
        Video.editVideo(_id, editData).then(function(data){
            if(data.data.success) {
                app.loading = false;
                app.successMsg = data.data.message;
                $timeout(function(){
                    app.editData = '';
                    app.successMsg = false;
                }, 2000);
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;                
            }
        })
    }
    
    //DELETE VIDEO
    app.isReal = function(userData) {
        app.loading = true;
        app.errorMsg = false; 

        Auth.isReal(userData).then(function(data) {
            if(data.data.success) {
                app.loading = false;
                app.successMsg = data.data.message + ' Please proceed.';
                app.userData.password = '';
                $timeout(function(){                  
                    app.successMsg = false;
                }, 10000);           
            }else{
                app.loading = false;
                app.errorMsg = data.data.message;
                app.userData.password = '';
                $timeout(function(){                    
                    app.errorMsg = false;
                }, 10000);
            }
        })           
     }

    app.predeleteVideo = function(_id, title) {
        vid = {};
        app.vid = {  _id: _id, title: title };
        return app.vid 
    }

    app.deleteVideo = function(_id) {
        Video.deleteVideo(_id).then(function(data) {
            if(data.data.success) {
                app.successMsg = data.data.message;
            } else {
                app.errorMsg = 'Something went wrong. Please try again.';  
            }

        });
    }
});

