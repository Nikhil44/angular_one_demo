angular.module('appRoutes', ['ngRoute'])
.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })
    .when('/about', {
        templateUrl: 'app/views/pages/about.html'
    })
    .when('/register', {
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'regCtrl',
        controllerAs: 'register'
    })
    .when('/login',{
        templateUrl: 'app/views/pages/users/login.html'
    })
    .when('/logout',{
        templateUrl: 'app/views/pages/users/logout.html'
    })
    .when('/profile', {
            templateUrl: 'app/views/pages/users/profile.html'
    })
    // Route: Facebook Callback Result 
    .when('/facebook/:token', {
            templateUrl: 'app/views/pages/users/social/social.html',
            controller: 'facebookCtrl',
            controllerAs: 'facebook',
            authenticated: false
        })

      // Route: Twitter Callback Result
    .when('/twitter/:token', {
        templateUrl: 'app/views/pages/users/social/social.html',
        controller: 'twitterCtrl',
        controllerAs: 'twitter',
        authenticated: false
    })

    // Route: Google Callback Result
    .when('/google/:token', {
        templateUrl: 'app/views/pages/users/social/social.html',
        controller: 'twitterCtrl',
        controllerAs: 'twitter',
        authenticated: false
    })

    .when('/facebookerror', {
        templateUrl: 'app/views/pages/users/login.html',
        controller: 'facebookCtrl',
        controllerAs: 'facebook',
        authenticated: false
    })

    // Route: Twitter Error
    .when('/twittererror', {
        templateUrl: 'app/views/pages/users/login.html',
        controller: 'twitterCtrl',
        controllerAs: 'twitter',
        authenticated: false
    })

        // Route: Google Error
    .when('/googleerror', {
        templateUrl: 'app/views/pages/users/login.html',
        controller: 'googleCtrl',
        controllerAs: 'google',
        authenticated: false
    })

        // Route: Facebook Account-Inactive Error
    .when('/facebook/inactive/error', {
        templateUrl: 'app/views/pages/users/login.html',
        controller: 'facebookCtrl',
        controllerAs: 'facebook',
        authenticated: false
    })

        // Route: Google Account-Inactive Error
    .when('/google/inactive/error', {
          templateUrl: 'app/views/pages/users/login.html',
          controller: 'googleCtrl',
          controllerAs: 'google',
          authenticated: false
    })

        // Route: Twitter Account-Inactive Error
    .when('/twitter/inactive/error', {
        templateUrl: 'app/views/pages/users/login.html',
        controller: 'twitterCtrl',
        controllerAs: 'twitter',
        authenticated: false
    })

        // Route: Twitter Not Yet Activated Error
    .when('/twitter/unconfirmed/error', {
        templateUrl: 'app/views/pages/users/login.html',
        controller: 'twitterCtrl',
        controllerAs: 'twitter',
        authenticated: false
    })



        
    .otherwise({ redirectTo: '/' }); // If user tries to access any other route, redirect to home page
    $locationProvider.html5Mode({ enabled: true, requireBase: false }); // Required to remove AngularJS hash from URL (no base is required in index file)
});
