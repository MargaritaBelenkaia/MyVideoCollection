angular.module('mainController', ['authServices'])

.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope) {
    var app = this;

    //Set app.loadme to false: HTML will wait for angular to load up at true
    app.loadme = false;

    //CHECK THE USER IS LOGGED IN
    $rootScope.$on('$routeChangeStart', function() {
        if (Auth.isLoggedIn()) {
            app.isLoggedIn = true;
            Auth.getUser().then(function(data) {
                app.name = data.data.name;
                app.username = data.data.username;
                app.loadme = true;
            });
        } else {
            app.isLoggedIn = false;
            app.username = '';
            app.loadme = true;
        }
    });

    //LOG IN
    app.doLogin = function() {
        app.loading = true;
        app.errorMsg = false;   
        
        Auth.login(app.loginData).then(function(data) {
            if(data.data.success) {
                app.loading = false;
                //Create success message
                app.successMsg = data.data.message + '...Redirecting';
                $timeout( function() {
                    //Redirect to home page
                    $location.path('/collection');
                    app.loginData = '';
                    app.successMsg = false;
                }, 2000);
            }else{
                app.loading = false;
                //Create an error message 
                app.errorMsg = data.data.message;
            }
        });           
    }

    //LOG OUT
    app.logout = function() {    
        Auth.logout();
        location.reload();
    }


});




