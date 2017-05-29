var app = angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
    
    $routeProvider

    .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })

    .when('/register', {
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'regCtrl',
        controllerAs: 'register',
        authenticated: false
    })

    .when ('/login', {
        templateUrl: 'app/views/pages/users/login.html',
        authenticated: false
    })

    .when ('/collection', {
        templateUrl: 'app/views/pages/video/collection.html',
        controller: 'collectionCtrl',
        controllerAs: 'manage',
        authenticated: true
    })

    .when ('/upload', {
        templateUrl: 'app/views/pages/video/upload.html',
        controller: 'addCtrl',
        controllerAs: 'upload',
        authenticated: true
    })

    .otherwise({ redirectTo: '/login'});

//Get rid of the annoying /!#/ angular thing
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location) {
    
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        
        if(next.$$route.authenticated == true) {

            if (!Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/login');

            }
        } else if(next.$$route.authenticated == false) {

            if (Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/collection');
            }
        }

    });
}]);




