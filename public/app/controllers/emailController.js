angular.module('emailController', ['userServices'])
    .controller('emailCtrl', function ($routeParams, User, $timeout, $location) {
        app = this;
        User.activateAccount($routeParams.token).then(function (data) {
            app.errorMsg = false; 
            if (data.data.success) {
                app.successMsg = data.data.message + '...Redirecting';
                $timeout(function () {
                    $location.path('/login');
                }, 2000);
            } else {
                app.errorMsg = data.data.message + '...Redirecting'; 
                $timeout(function () {
                    $location.path('/login');
                }, 2000);
            }
        });
    })
    .controller('resendCtrl', function (User, $scope) {
        app = this;
        app.checkCredentials = function (loginData, valid) {
            if (valid) {
                app.disabled = true; 
                app.errorMsg = false;
                User.checkCredentials(app.loginData).then(function (data) {
                    if (data.data.success) {
                        User.resendLink(app.loginData).then(function (data) {
                            if (data.data.success) {
                                $scope.alert = 'alert alert-success'; 
                                app.successMsg = data.data.message; 
                            } else {
                                $scope.alert = 'alert alert-danger'; 
                                app.errorMsg = data.data.message; 
                            }
                        });
                    } else {
                        app.disabled = false; 
                        $scope.alert = 'alert alert-danger'; 
                        app.errorMsg = data.data.message; 
                    }
                });
            } else {
                $scope.alert = 'alert alert-danger'; 
                app.errorMsg = 'Please ensure form is filled out properly';
            }
        };
    });