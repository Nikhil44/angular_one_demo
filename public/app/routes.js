angular.module('appRoutes', ['ngRoute'])
.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })
    .when('/about', {
        templateUrl: 'app/views/pages/about.html'
    })
    .otherwise({ redirectTo: '/' }); // If user tries to access any other route, redirect to home page
    $locationProvider.html5Mode({ enabled: true, requireBase: false }); // Required to remove AngularJS hash from URL (no base is required in index file)
});
