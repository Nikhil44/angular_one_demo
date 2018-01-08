angular.module('userControllers', ['userServices'])
// Controller: regCtrl is used for users to register an account
.controller('regCtrl', function($http,$location,$timeout, User) {
	var app = this;
  this.regUser = function(regData) {
  			User.create(app.regData).then(function (res) {
          		app.errorMsg = false;
          		app.loading = true;
          		if(res.data.success)
          		{
          			app.loading = false;
          			app.sucessMsg = res.data.message + "...redicating";
          			$timeout(function() {
          				$location.path('/');
          			}, 10000);

          		}
          		else
          		{
          			app.loading = false;
          			app.errorMsg = res.data.message;
          		}
          });
      };
});
