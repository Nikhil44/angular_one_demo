var app = angular
        .module("myModule", [])
        .controller("myController", function ($scope) {

            var employees = [
                {
                    name: "ABC", dateOfBirth: new Date("November 23, 1992"),
                    gender: "Male", salary: 20050
                },
                {
                    name: "CCC", dateOfBirth: new Date("May 05, 1992"),
                    gender: "Female", salary: 20050
                },
                {
                    name: "BBB", dateOfBirth: new Date("August 15, 1992"),
                    gender: "Male", salary: 20050
                },
                {
                    name: "DDD", dateOfBirth: new Date("October 27, 1992"),
                    gender: "Female", salary: 53000
                },
                {
                    name: "FFF", dateOfBirth: new Date("December 30, 1992"),
                    gender: "Male", salary: 20050
                }
            ];

            $scope.employees = employees;
            $scope.sortColumn = "name";
            $scope.reverseSort = false;

            $scope.sortData = function (column) {
                $scope.reverseSort = ($scope.sortColumn == column) ?
                    !$scope.reverseSort : false;
                $scope.sortColumn = column;
            }

            $scope.getSortClass = function (column) {

                if ($scope.sortColumn == column) {
                    return $scope.reverseSort ? 'arrow-down' : 'arrow-up';
                }
20050
                return '';
            }
        });
