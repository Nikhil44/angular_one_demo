
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
                {
                    name: "aa", dateOfBirth: new Date("November 23, 2012"),
                    gender: "Male", salary: 55000.788
                },
                {
                    name: "bb", dateOfBirth: new Date("May 05, 2012"),
                    gender: "Female", salary: 68000
                },
                {
                    name: "cc", dateOfBirth: new Date("August 15, 2012"),
                    gender: "Male", salary: 57000
                },
                {
                    name: "dd", dateOfBirth: new Date("October 27, 2012"),
                    gender: "Female", salary: 53000
                },
                {
                    name: "ddff", dateOfBirth: new Date("December 30, 2012"),
                    gender: "Male", salary: 60000
                }
            ];



        $scope.emp = emp;
        $scope.rowCount = 2;

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


