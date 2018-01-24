angular.module('mainController', ['authServices'])
.controller('mainCtrl', function($location,$timeout, Auth, $rootScope) 
{
	var app = this;
	app.loadme = false;

	$rootScope.$on('$routeChangeStart', function () {

		if (Auth.isloggedIn()) {
			app.isloggedIn = true;
			app.loadme = true;
			console.log(app.isloggedIn);
			Auth.getUser().then(function(data) {
				app.username = data.data.username;
				app.email = app.email;
			});
		}
		else {
			app.isloggedIn = false;
			app.loadme = true;
			console.log('Failure: User is not Logged in');
			app.username = false;
		}	


		if ($location.hash() == '_=_') $location.hash(null); // Check if facebook hash is added to URL

	});


	this.facebook = function () {
		app.disabled = true;
		$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
	};

	// Function to redirect users to twitter authentication page        
	this.twitter = function () {
		app.disabled = true;
		$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/twitter';
	};

	// Function to redirect users to google authentication page
	this.google = function () {
		app.disabled = true;
		$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
	};

	
  this.doLogin = function(loginData) 
  {
  			Auth.login(app.loginData).then(function (res) {
          		app.errorMsg = false;
          		app.loading = true;
				console.log(res);
          		if(res.data.success)
          		{
					app.loading = false;
					app.sucessMsg = res.data.message + "...redicating";
					  
          			$timeout(function() {
						  $location.path('/');
						  app.loginData = '';
						  app.sucessMsg = false;
          			}, 10000);
          		}
          		else
          		{
          			app.loading = false;
          			app.errorMsg = res.data.message;
          		}
          });
  };

  this.logout = function()
  {
	  Auth.logout();
	  $location.path('/logout');
	  $timeout(function(){
		  $location.path('/');
	  },2000)
  }

});
