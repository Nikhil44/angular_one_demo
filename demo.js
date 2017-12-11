
//# first way
//var myApp = angular.module("myModule", []);

/*
// Creating the controller and registering with the module all done in one line using ES6
myApp.controller("myController",($scope) => {
	$scope.message = "AngularJS test app";
	var emp =  {
         firstName: 'Kapil',
         lastName: 'Bang',
         gender: 'Male'
    };

    $scope.emp = emp;
});
*/

//# second way

/*
	//Create the controller
	var myController = function ($scope) {
	    $scope.message = "AngularJS test app";
	}


	// Register the controller with the module
	myApp.controller("myController", myController);

 */


//# threed way

//# Creating the controller and registering with the module all done in one line using ES5

/*
myApp.controller("mycontroller", function ($scope) {
	    $scope.message = "AngularJS test app";
})

 */

// fourth way method chaining mechanism

var myApp = angular
    .module("myModule", [])
    .controller("myController",($scope) => {
    	$scope.message = "AngularJS test app";
        var emp = {
            firstName: 'Kapil',
            lastName: 'Bang',
            gender: 'Male'
        };
        $scope.emp = emp;
    });


