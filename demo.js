
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
    	var emp = [
                    { firstName: "anc", lastName: "DD", gender: "Male", salary: 20000 },
                    { firstName: "sdgf", lastName: "qq", gender: "Female", salary: 68000 },
                    { firstName: "fv", lastName: "aa", gender: "Male", salary: 57000 },
                    { firstName: "ggg", lastName: "bb", gender: "Female", salary: 53000 },
                    { firstName: "FFF", lastName: "cc", gender: "Male", salary: 60000 }
                ];
        $scope.emp = emp;

         var countries = [
                    {
                        name: "UK",
                        cities: [
                            { name: "London" },
                            { name: "Birmingham" },
                            { name: "Manchester" }
                        ]
                    },
                    {
                        name: "USA",
                        cities: [
                            { name: "Los Angeles" },
                            { name: "Chicago" },
                            { name: "Houston" }
                        ]
                    },
                    {
                        name: "India",
                        cities: [
                            { name: "Hyderabad" },
                            { name: "Chennai" },
                            { name: "Mumbai" }
                        ]
                    }
                ];

                $scope.countries = countries;
    });


