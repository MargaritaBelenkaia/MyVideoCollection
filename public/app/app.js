angular

.module('userApp', ['appRoutes', 'userController', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'videoController', 'videoServices', 'collectionController'])

.config(['$httpProvider', function($httpProvider) {  

    $httpProvider.interceptors.push('AuthInterceptors');

}]);


