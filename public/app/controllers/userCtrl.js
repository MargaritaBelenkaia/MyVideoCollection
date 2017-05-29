angular.module('userController', ['userServices'])

.controller('regCtrl', function($location, $timeout, User){

    var app = this;

    //REGISTER
    this.regUser = function(regData) {
        app.loading = true;
        app.errorMsg = false;

        User.create(app.regData).then(function(data){
            if(data.data.success) {
                app.loading = false;
                //Create success message
                app.successMsg = data.data.message + '...Redirecting';
                $timeout( function() {
                    //Redirect to login page
                    $location.path('/login');
                }, 2000);
            }else{
                app.loading = false;
                //Create an error message 
                app.errorMsg = data.data.message;
            }
        })
    };
});
