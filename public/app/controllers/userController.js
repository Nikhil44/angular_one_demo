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
})

.controller('facebookCtrl', function ($routeParams, Auth, $location, $window, $scope) {

		var app = this;
		app.errorMsg = false; // Clear errorMsg on page load
		app.expired = false; // Clear expired on page load
		app.disabled = true; // On page load, remove disable lock from form

		// Check if callback was successful 
		if ($window.location.pathname == '/facebookerror') {
			app.errorMsg = 'Facebook e-mail not found in database.'; // If error, display custom message
		} else if ($window.location.pathname == '/facebook/inactive/error') {
			app.expired = true; // Variable to activate "Resend Link Button"
			app.errorMsg = 'Account is not yet activated. Please check your e-mail for activation link.'; // If error, display custom message
		} else {
			Auth.socialMedia($routeParams.token); // If no error, set the token
			$location.path('/'); // Redirect to home page
		}
})

.controller('twitterCtrl', function ($routeParams, Auth, $location, $window, $scope) {

	var app = this;
	app.errorMsg = false; // Clear errorMsg on page load
	app.expired = false; // Clear expired on page load
	app.disabled = true; // On page load, remove disable lock from form

	// Check if callback was successful         
	if ($window.location.pathname == '/twittererror') {
		$scope.alert = 'alert alert-danger'; // Set class for message
		app.errorMsg = 'Twitter e-mail not found in database.'; // If error, display custom message
	} else if ($window.location.pathname == '/twitter/inactive/error') {
		app.expired = true; // Variable to activate "Resend Link Button"
		$scope.alert = 'alert alert-danger'; // Set class for message
		app.errorMsg = 'Account is not yet activated. Please check your e-mail for activation link.'; // If error, display custom message
	} else if ($window.location.pathname == '/twitter/unconfirmed/error') {
		$scope.alert = 'alert alert-danger'; // Set class for message
		app.errorMsg = 'Your twitter account is either inactive or does not have an e-mail address attached to it.'; // If error, display custom message
	} else {
		Auth.socialMedia($routeParams.token); // If no error, set the token
		$location.path('/'); // Redirect to home page
	}
})

	 
.controller('googleCtrl', function ($routeParams, Auth, $location, $window, $scope) {

		var app = this;
		app.errorMsg = false; // Clear errorMsg on page load
		app.expired = false; // Clear expired on page load
		app.disabled = true; // On page load, remove disable lock from form

		// Check if callback was successful         
		if ($window.location.pathname == '/googleerror') {
			$scope.alert = 'alert alert-danger'; // Set class for message
			app.errorMsg = 'Google e-mail not found in database.'; // If error, display custom message
		} else if ($window.location.pathname == '/google/inactive/error') {
			app.expired = true; // Variable to activate "Resend Link Button"
			$scope.alert = 'alert alert-danger'; // Set class for message
			app.errorMsg = 'Account is not yet activated. Please check your e-mail for activation link.'; // If error, display custom message
		} else {
			Auth.socialMedia($routeParams.token); // If no error, set the token
			$location.path('/'); // Redirect to home page
		}
	});

