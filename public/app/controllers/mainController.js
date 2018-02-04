angular.module('mainController', ['authServices', 'userServices'])
	.controller('mainCtrl', function ($location, $timeout, Auth,$window, $rootScope, $scope, $interval,$route,User,AuthToken)
{
	var app = this;
	app.loadme = false;
	if ($window.location.pathname === '/') app.home = true;

		if (Auth.isloggedIn()) {
			Auth.getUser().then(function (data) {
				if (data.data.username === undefined) {
					Auth.logout();
					app.isLoggedIn = false;
					$location.path('/');
					app.loadme = true;
				}
			});
		}

	app.checkSession = function () {
		if (Auth.isloggedIn()) {
			app.checkingSession = true;
			var interval = $interval(function () {
				 var token = $window.localStorage.getItem('token'); // Grab error message from JSON object.localStorage.getItem('token');
				if (token === null) {
					$interval.cancel(interval);
				} else {
					self.parseJwt = function (token) {
						console.log(token);
						var base64Url = token.split('.')[1];
						var base64 = base64Url.replace('-', '+').replace('_', '/');
						return JSON.parse($window.atob(base64));
					};
					var expireTime = self.parseJwt(token);
					var timeStamp = Math.floor(Date.now() / 1000);
					var timeCheck = expireTime.exp - timeStamp;
					console.log(timeCheck);
					if (timeCheck <= 1800) {
						showModal(1);
						$interval.cancel(interval);
					}
				}
			}, 30000);
		}
	};

	app.checkSession();

	var showModal = function (option) {
		app.choiceMade = false;
		app.modalHeader = undefined;
		app.modalBody = undefined;
		app.hideButton = false;
		if (option === 1) {
			app.modalHeader = 'Timeout Warning';
			app.modalBody = 'Your session will expired in 30 minutes. Would you like to renew your session?';
			$("#myModal").modal({ backdrop: "static" });
			$timeout(function () {
				if (!app.choiceMade) app.endSession();
			}, 10000);
		} else if (option === 2) {
			app.hideButton = true;
			app.modalHeader = 'Logging Out';
			$("#myModal").modal({ backdrop: "static" });
			$timeout(function () {
				Auth.logout();
				$location.path('/logout');
				hideModal();
			}, 2000);
		}
	};


	app.renewSession = function () {
		app.choiceMade = true;
		User.renewSession(app.username).then(function (data) {

			if (data.data.success) {
				AuthToken.setToken(data.data.token);
				app.checkSession();
			} else {
				app.modalBody = data.data.message;
			}
		});
		hideModal();
	};


	app.endSession = function () {
		app.choiceMade = true;
		hideModal();
		$timeout(function () {
			showModal(2);
		}, 1000);
	};

	var hideModal = function () {
		$("#myModal").modal('hide');
	};

   $rootScope.$on('$routeChangeSuccess', function () {
			if ($window.location.pathname === '/') {
				app.home = true;
			} else {
				app.home = false;
			}
	});


	$rootScope.$on('$routeChangeStart', function () {
		if (!app.checkingSession) app.checkSession();
		if (Auth.isloggedIn()) {
			Auth.getUser().then(function (data) {
				if (data.data.username === undefined) {

					app.isLoggedIn = false;
					Auth.logout();
					app.isLoggedIn = false;
					$location.path('/');
				} else {

					app.isLoggedIn = true;
								console.log(app.isLoggedIn);
					app.username = data.data.username;
					checkLoginStatus = data.data.username;
					app.useremail = data.data.email;
					User.getPermission().then(function (data) {
						if (data.data.permission === 'admin' || data.data.permission === 'moderator') {
							app.authorized = true;
							app.loadme = true;
						} else {
							app.authorized = false;
							app.loadme = true;
						}
					});
				}
			});
		}
		else {
			app.isLoggedIn = false;
			app.loadme = true;
			app.username = '';
		}

		if ($location.hash() == '_=_') $location.hash(null);
		app.disabled = false;
		app.errorMsg = false;

	});

	this.facebook = function () {
		app.disabled = true;
		$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
	};


	this.twitter = function () {
		app.disabled = true;
		$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/twitter';
	};

	this.google = function () {
		app.disabled = true;
		$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
	};


    this.doLogin = function(loginData)
    {
	  app.errorMsg = false;
	  app.loading = true;
	  app.expired = false;
	  app.disabled = true;
	  $scope.alert = 'default';

  			Auth.login(app.loginData).then(function (res) {
          		if(res.data.success)
          		{
					app.loading = false;
					$scope.alert = 'alert alert-success';
					app.sucessMsg = res.data.message + "...redicating";
          			$timeout(function() {
						  $location.path('/');
						  app.loginData = '';
						  app.sucessMsg = false;
						  app.disabled = false;
						 app.checkSession();
          			}, 1000);
          		}
          		else
          		{
					  if(res.data.expired)
					  {
						  app.loading = true;
						  app.loading = false;
						  $scope.alert = 'alert alert-danger';
						  app.errorMsg = res.data.message;

					  }
					  else
					  {
						  app.loading  = false;
						  app.disabled = true;
						  $scope.alert = 'alert alert-danger';
						  app.errorMsg = res.data.message;
					  }

          		}
          });
    };

   app.logout = function()
   {
	  showModal(2);
   };

});
