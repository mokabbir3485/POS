///<reference path="angular.js" />

var incomeApp = angular.module('incomeApp', ['LocalStorageModule', 'AuthApp']);

incomeApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

incomeApp.controller('incomeController', ['$scope', 'incomeService', function ($scope, incomeService) {


    Clear();
    function Clear() {
        $scope.ddlPage = {};
        $scope.PageList = [{ PageId: 1, PageNo: '10', PageNoShow: '10' }, { PageId: 2, PageNo: '50', PageNoShow: '50' }, { PageId: 3, PageNo: '100', PageNoShow: '100' }, { PageId: 4, PageNo: '500', PageNoShow: '500' }, { PageId: 5, PageNo: '10000000', PageNoShow: 'All' }]
        $scope.ddlPage.PageNo = '10';
        $scope.IncomeList = [];
        GetAllIncome();
        $scope.TotalIncome = 0;
    }
    $scope.PrintDoc = function () {
        $('.widget').attr('class', 'forprint green');
        window.print();
        $('.forprint').attr('class', 'widget green');

    }
    function GetAllIncome() {
        incomeService.GetAllIncome().then(function (response) {
            $scope.IncomeList = response.data;
            console.log($scope.IncomeList);
            angular.forEach($scope.IncomeList, function (income) {
                $scope.TotalIncome += income.TotalAmount; 
            })
        }, function () {
            alert("Failed to get Income!");
        })
    };
    $scope.Delete = function (bankDetail) {
        var r = confirm("Are you sure you want to delete?");
        if (r == true) {
            incomeService.DeleteBankDetail(bankDetail).then(function (response) {
                alert("Bank Detail Deleted Successfully");
                Clear();
                window.location.reload();
            }, function () {
                Clear();
                alert("Error occured. Please try again.");

            });
        } else {
            Clear();
            return;
        }
    }
    

}])


incomeApp.factory('incomeService', ['$http', function ($http) {

    var incomeAppFactory = {};
    incomeAppFactory.GetAllIncome = function () {
        return $http.get('/api/Incomes/GetAllTIncome')
    }
    
    return incomeAppFactory;

}])

