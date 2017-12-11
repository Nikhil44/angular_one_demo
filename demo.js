var app = angular
        .module("myModule", [])
        .controller("myController", function ($scope) {

            var employees = [
                {
                    name: "ABC", dateOfBirth: new Date("November 23, "),
                    gender: "Male", salary: 20050 , city: "Dhule"
                },
                {
                    name: "CCC", dateOfBirth: new Date("May 05, "),
                    gender: "Female", salary: 20050 , city: "Aurganbad"
                },
                {
                    name: "BBB", dateOfBirth: new Date("August 15, "),
                    gender: "Male", salary: 20050, city: "Mumbai"
                },
                {
                    name: "DDD", dateOfBirth: new Date("October 27, "),
                    gender: "Female", salary: 53000, city: "Beed"
                },
                {
                    name: "FFF", dateOfBirth: new Date("December 30, "),
                    gender: "Male", salary: 20050, city: "Pune"
                }
            ];

            $scope.employees = employees;

            $scope.search = function (item) {
                if ($scope.searchText == undefined) {
                    return true;
                }
                else {
                    if (item.city.toLowerCase()
                                 .indexOf($scope.searchText.toLowerCase()) != -1 ||
                        item.name.toLowerCase()
                                 .indexOf($scope.searchText.toLowerCase()) != -1) {
                        return true;
                    }
                }

                return false;
            };
        });