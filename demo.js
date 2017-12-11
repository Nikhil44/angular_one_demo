var myApp = angular.module("myModule", []);

//# first way


// Creating the controller and registering with the module all done in one line using ES6
myApp.controller("myController",($scope) => {$scope.message = "AngularJS test app";});

//# second way
/*
	//Create the controller
	var myController = function ($scope) {
	    $scope.message = "AngularJS test app";
	}


	// Register the controller with the module
	myApp.controller("myController", myController);

 */


//# Creating the controller and registering with the module all done in one line using ES5
/*
myApp.controller("mycontroller", function ($scope) {
	    $scope.message = "AngularJS test app";
})

 */