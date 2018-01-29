var app = angular.module('appRoutes', ['ngRoute'])
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
            controllerAs: 'register',
            authenticated: false
        })
        .when('/login',{
            templateUrl: 'app/views/pages/users/login.html',
            authenticated: false
        })
        .when('/logout',{
            templateUrl: 'app/views/pages/users/logout.html',
            authenticated: true
        })
        .when('/profile', {
            templateUrl: 'app/views/pages/users/profile.html',
            authenticated: true
        })
       .when('/facebook/:token', {
            templateUrl: 'app/views/pages/users/social/social.html',
            controller: 'facebookCtrl',
            controllerAs: 'facebook',
            authenticated: false
        })
        .when('/twitter/:token', {
            templateUrl: 'app/views/pages/users/social/social.html',
            controller: 'twitterCtrl',
            controllerAs: 'twitter',
            authenticated: false
        })
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
        .when('/twittererror', {
            templateUrl: 'app/views/pages/users/login.html',
            controller: 'twitterCtrl',
            controllerAs: 'twitter',
            authenticated: false
        })
        .when('/googleerror', {
            templateUrl: 'app/views/pages/users/login.html',
            controller: 'googleCtrl',
            controllerAs: 'google',
            authenticated: false
        })
        .when('/facebook/inactive/error', {
            templateUrl: 'app/views/pages/users/login.html',
            controller: 'facebookCtrl',
            controllerAs: 'facebook',
            authenticated: false
        })
        .when('/google/inactive/error', {
            templateUrl: 'app/views/pages/users/login.html',
            controller: 'googleCtrl',
            controllerAs: 'google',
            authenticated: false
        })
        .when('/twitter/inactive/error', {
            templateUrl: 'app/views/pages/users/login.html',
            controller: 'twitterCtrl',
            controllerAs: 'twitter',
            authenticated: false
        })
        .when('/twitter/unconfirmed/error', {
            templateUrl: 'app/views/pages/users/login.html',
            controller: 'twitterCtrl',
            controllerAs: 'twitter',
            authenticated: false
        })
        .when('/activate/:token', {
            templateUrl: 'app/views/pages/users/activation/activate.html',
            controller: 'emailCtrl',
            controllerAs: 'email',
            authenticated: false
        })
        .when('/resend', {
            templateUrl: 'app/views/pages/users/activation/resend.html',
            controller: 'resendCtrl',
            controllerAs: 'resend',
            authenticated: false
        })

        .otherwise({ redirectTo: '/' }); 
        $locationProvider.html5Mode({ enabled: true, requireBase: false }); 
});

app.run(['$rootScope', 'Auth', '$location', 'User', function ($rootScope, Auth, $location, User) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if (next.$$route.authenticated === true) { 
                if (!Auth.isloggedIn()) {
                   console.log("ok");
                    event.preventDefault();
                    $location.path('/'); 
                } 
            } else if (next.$$route.authenticated === false) {
                if (Auth.isloggedIn()) {
                    event.preventDefault();
                    $location.path('/profile'); 
                }
            }
        });
}]);