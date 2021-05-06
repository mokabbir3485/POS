///<reference path="angular.js" />

var homeApp = angular.module('homeApp', ['LocalStorageModule', 'AuthApp']);

homeApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

homeApp.controller('homeController', ['$scope', 'homeService', function ($scope, homeService) {


    Clear();
    function Clear() {
        $scope.Expense = [];
        $scope.Transaction = [];
        $scope.ExpenseOrders = [];
        $scope.ExpenseOthers = [];
        $scope.OrdersCost = 0;
        $scope.OthersCost = 0;
        $scope.TotalCost = 0;
        $scope.TotalSales = 0;
        $scope.TotalProfit = 0;
        $scope.home = {};
    }
    function convert(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }
    $scope.getDetails = function (home) {
        $scope.OrdersCost = 0;
        $scope.OthersCost = 0;

        $scope.TotalSales = 0;
        $scope.TotalProfit = 0;
        $scope.home.startdate = convert(home.startdate);
        $scope.home.enddate = convert(home.enddate);
        homeService.getExpenseDetails($scope.home).then(function (response) {
            $scope.Expense = response.data;
            homeService.getTransactionDetails($scope.home).then(function (response) {
                $scope.Transaction = response.data;
                angular.forEach($scope.Transaction, function (tdata) {
                    $scope.TotalSales += tdata.SubTotal;
                })
                $scope.TotalCost = $scope.OrdersCost + $scope.OthersCost;
                $scope.TotalProfit = $scope.TotalSales - $scope.TotalCost;
            })
            angular.forEach($scope.Expense, function (edata) {
                if (edata.ExpenseType == 'Orders') {
                    $scope.ExpenseOrders.push(edata);
                    $scope.OrdersCost += edata.Amount;
                } else {
                    $scope.ExpenseOthers.push(edata);
                    $scope.OthersCost += edata.Amount;
                }
            })

        }, function () {
            alert("Failed to get Expense!");
        })

        

        //angular.forEach($scope.Expense, function (data) {
        //    if (data.ExpenseType == 'Orders') {
        //        $scope.ExpenseOrders.push(data);
        //    } else {
        //        $scope.ExpenseOthers.push(data);
        //    }
        //})
    }


}])


homeApp.factory('homeService', ['$http', function ($http) {

    var homeAppFactory = {};

    homeAppFactory.getExpenseDetails = function (home) {
        return $http.post('/api/Home/getExpenseDetails/', home)
    }
    homeAppFactory.getTransactionDetails = function (home) {
        return $http.post('/api/Home/getTransactionDetails/', home)
    }

    return homeAppFactory;

}])

